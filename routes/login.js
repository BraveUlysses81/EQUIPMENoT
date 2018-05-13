var app = require('express');
var router = app.Router();
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config  = require('../config/config');
var signupValidation = require('./shared/signupValidation');
var validateDuplicateInput = require('./shared/validateDuplicateInput');
var webEmailContactFormValidation = require('./shared/webEmailContactFormValidation');
var Promise = require('bluebird');
var isEmpty = require('lodash/isEmpty');
var validator = require('validator');
var dateFormat = require('dateformat');
var now = new Date();
var AWS = require('aws-sdk');
var ses = new AWS.SES();
var sns = new AWS.SNS();

AWS.config.update({region:'us-east-1'});

AWS.config.credentials = new AWS.EC2MetadataCredentials({
    httpOptions: { timeout: 5000 }, // 5 second timeout
    maxRetries: 10, // retry 10 times
    retryDelayOptions: { base: 200 } // see AWS.Config for information
});

//post route to login a member
router.post('/login/member/:membership_id', (req, res) => {
    var db = req.app.get('conn');
    var membership_id = req.params.membership_id;

    db.one("SELECT " +
        "m.membership_id, " +
        "m.membership_type, " +
        "m.member_view_rights," +
        "m.dispatch_view_rights," +
        "m.instructor_view_rights, " +
        "m.admin_view_rights," +
        "s.school_id, " +
        "s.school_logo, " +
        "CASE " +
        "WHEN m.admin_view_rights THEN 'admin'::text " +
        "WHEN m.dispatch_view_rights THEN 'dispatch'::text " +
        "ELSE 'member'::text " +
        "END AS role " +
        "FROM membership m " +
        "LEFT JOIN school s " +
        "ON (m.school_id = s.school_id) " +
        "LEFT JOIN person p " +
        "ON (p.person_id = m.person_id) " +
        "WHERE m.membership_id = $1", membership_id
    )
        .then((member) => {
        if(member){
            const token2 = jwt.sign({
                membership_id: member.membership_id,
                membership_type: member.membership_type,
                member_view_rights: member.member_view_rights,
                dispatch_view_rights: member.dispatch_view_rights,
                instructor_view_rights: member.instructor_view_rights,
                admin_view_rights: member.admin_view_rights,
                school_id: member.school_id,
                role: member.role,
                school_logo: member.school_logo
                }, config.jwt.jwtSecret);
            res.json(token2);
            }else {
            res.status(400).json({form: 'Member not found'})
        }
        })
        .catch((err) => {
            res.status(400).json(err)
        })

});

//the POST method for a login check as the endpoint of a login attempt
router.post('/login', (req, res) => {
    var db = req.app.get('conn');
    const { identifier, password } = req.body
    db.one("SELECT l.login_id, " +
        "l.username, " +
        "l.email, " +
        "l.password, " +
        "l.requested_school, " +
        "p.person_id, " +
        "p.first_name, " +
        "p.last_name, " +
        "p.picture_url " +
        "FROM login l " +
        "LEFT JOIN person p " +
        "ON (l.login_id = p.login_id) " +
        "WHERE l.username = $1 " +
        "OR l.email = $1" , identifier)
        .then( user => {
            if (user){
                if (bcrypt.compareSync(password, user.password)){
                    const token = jwt.sign({
                        login_id: user.login_id,
                        username: user.username,
                        person_id: user.person_id,
                        picture_url: user.picture_url
                    }, config.jwt.jwtSecret );
                    res.json(token);
                } else {
                    res.status(401).json({ form: 'Invalid User or Password'  })
                }
            } else {
                res.status(401).json({ form: 'Invalid User or Password'  })
            }
        })
        .catch(function (error) {
            res.status(401).json({ form: 'Connection error'})
        });
})


router.post('/login/modify', (req, res) => {
    var db = req.app.get('conn');
    const { login_id, currentPassword, newPassword, passwordConfirmation } = req.body;
    db.one("SELECT * " +
        "FROM login " +
        "WHERE login_id = $1", login_id)
        .then( user => {
            if(user && bcrypt.compareSync(currentPassword, user.password)){
                if(validator.equals(newPassword, passwordConfirmation)){
                    const password_digest = bcrypt.hashSync(newPassword, 10);
                    db.one("UPDATE login " +
                        "SET password = $1 " +
                        "WHERE login_id = $2 " +
                        "RETURNING login", [password_digest, user.login_id])
                        .then( () => {
                            res.status(200).json('success');
                        })
                        .catch(() => {
                            res.status(400).json({ form: 'Update not successful' });
                        });
                } else {
                    res.status(400).json({ form: 'New Passwords do not match' })
                }
            } else {
                res.status(400).json({ form: 'Current Password Invalid' })
            }
        })
        .catch(() => {
            res.status(400).json({ form: 'Connection Error' })
        })
});



router.post('/login/resend/:invite_id', (req, res) => {
    var db = req.app.get('conn');
    var inviteId = req.params.invite_id;
    var personName = "";
    var status = "";
    var personAddress = "";
    var mobile = "";

    db.task((t) => {
        return t.one("SELECT i.onboarding_status " +
            'FROM invite i ' +
            'WHERE i.invite_id = $1', [inviteId])
            .then(invite => {
                status = invite.onboarding_status;
                return t.one("SELECT l.login_id, " +
                    "l.email " +
                    "FROM login l " +
                    "JOIN invite i " +
                    "ON (l.login_id = i.login_id) " +
                    "WHERE i.invite_id = $1", [inviteId])
                    .then(login => {
                        personAddress = login.email;
                        return t.one("SELECT p.person_id, " +
                            "p.mobile," +
                            "p.first_name," +
                            "p.last_name " +
                            "FROM person p " +
                            "JOIN login l " +
                            "ON (l.login_id = p.login_id) " +
                            "WHERE l.login_id = $1", [login.login_id])
                            .then(person => {
                                AWS.config.getCredentials();
                                console.log(person);
                                mobile = person.mobile;
                                personName = person.first_name + person.last_name;
                                if (status == 'pending') {
                                    ses.sendEmail({
                                        Destination: {
                                            ToAddresses: [
                                                personAddress
                                            ]
                                        },
                                        Message: {
                                            Body: {
                                                Html: {
                                                    Charset: "UTF-8",
                                                    Data: "Hello, " + personName + ", welcome to EQUIP.ME.NoT. </br>" +
                                                    "We hope to see you soon, but first please fill out a little bit of information for us. </br>" +
                                                    "Please follow the link to finish the last pieces of registration and we'll see you soon! </br>" +
                                                    "<a class=\"ulink\" href=\"http://34.200.245.26:8080/contact/form/web/member/" + inviteId + "\" " + "target=\"_blank\">EQUIP.ME.NoT Contact Info Page</a>."
                                                }
                                            },
                                            Subject: {
                                                Charset: "UTF-8",
                                                Data: "Please fill out your EQUIP.ME.NoT contact info"
                                            },

                                        },
                                        Source: "willie.witten@gmail.com"
                                    }, function (err, data) {
                                        if (err) {
                                            console.log(err, err.stack);
                                        }
                                        else {
                                            console.log('email sent');
                                            console.log(data);
                                            res.status(200).end();
                                        }
                                    })
                                } else if (status == 'open') {
                                    console.log(mobile);
                                    var params = {
                                        Message: "Please go to the link to provide us the minimum info we need to get you in the air today!" +
                                        "<br/>http://34.200.245.26:8080/contact/form/mobile/member/" + inviteId + " ",
                                        MessageStructure: 'STRING_VALUE',
                                        PhoneNumber: '+1' + mobile,
                                        Subject: 'Please quickly provide some info to EQUIP.ME.NoT!',
                                    };
                                    sns.publish(params, function (err, data) {
                                        if (err) {
                                            console.log(err, err.stack);
                                        }
                                        else {
                                            console.log("SMS code sent")
                                            console.log(data);
                                            res.status(200).end();
                                        }
                                    })
                                }
                                else {
                                    res.status(200).end();
                                }

                            })
                            .catch(function (error) {
                                console.log("ERROR:", error);
                            })
                    })
                    .catch(() => {
                        res.status(400).json({form: 'Connection Error'})
                    })
            })
            .catch(function (error) {
                console.log("ERROR:", error);
            })
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        })
});




module.exports = router;