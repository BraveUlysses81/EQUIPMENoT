var app = require('express');
var router = app.Router();
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config  = require('./../config/config');
var signupValidation = require('./shared/signupValidation');
var validateDuplicateInput = require('./shared/validateDuplicateInput');
var webEmailContactFormValidation = require('./shared/webEmailContactFormValidation');
var mobileContactFormValidation = require('./shared/mobileContactFormValidation');
var emailContactFormValidation = require('./shared/emailContactFormValidation');
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


//the POST method for a login check as the endpoint of a login attempt
router.post('/signup/short/:school_id', (req, res) => {
    var db = req.app.get('conn');
    var schoolId = req.params.school_id;
    var personId = "";
    var inviteId = "";
    var loginId = "";
    var mobile = "";

    const password = (function (n){
        let pass = "";
        for (i = 0; i < n; i++){
            pass = pass + Math.floor(Math.random() * 10);
        }
        return pass;
    })(6);

    const password_digest = bcrypt.hashSync(password, 10);

    db.task((t) => {
        return t.one("INSERT " +
            "INTO login " +
            "(" +
            "createdat" +
            ") " +
            "VALUES " +
            "(" +
            "$1" +
            ") " +
            "RETURNING login_id", [dateFormat(now, "isoDateTime")])
            .then(login => {
                loginId = login.login_id;
                return t.one("INSERT " +
                    "INTO invite " +
                    "(" +
                    "login_id, " +
                    "school_id, " +
                    "invite_sent, " +
                    "onboarding_status, " +
                    "password" +
                    ") " +
                    "VALUES " +
                    "(" +
                    "$1, " +
                    "$2, " +
                    "$3, " +
                    "$4, " +
                    "$5" +
                    ") " +
                    "RETURNING invite_id, login_id, school_id", [login.login_id, schoolId, true, "open", password_digest])
                    .then(invite => {
                        inviteId = invite.invite_id;
                        return t.one("INSERT " +
                            "INTO person " +
                            "(" +
                            "first_name, " +
                            "last_name, " +
                            "mobile, " +
                            "login_id" +
                            ") " +
                            "VALUES " +
                            "(" +
                            "$1, " +
                            "$2, " +
                            "$3, " +
                            "$4" +
                            ") " +
                            "RETURNING person_id, mobile", [req.body.first_name, req.body.last_name, req.body.mobile, loginId])
                            .then(person => {
                                personId = person.person_id;
                                mobile = person.mobile;
                                return t.one("INSERT " +
                                    "INTO membership " +
                                    "(" +
                                    "person_id, " +
                                    "school_id, " +
                                    "membership_type" +
                                    ") " +
                                    "VALUES " +
                                    "(" +
                                    "$1, " +
                                    "$2, " +
                                    "$3" +
                                    ") " +
                                    "RETURNING membership_id, person_id, school_id, membership_type", [personId, schoolId, req.body.membership_type])
                                    .then(membership => {
                                        return t.one("INSERT " +
                                            "INTO contact " +
                                            "(" +
                                            "person_id" +
                                            ") " +
                                            "VALUES " +
                                            "(" +
                                            "$1" +
                                            ") " +
                                            "RETURNING person_id, contact_id", [personId])
                                            .then(contact => {
                                                return t.one("INSERT " +
                                                    "INTO documentation " +
                                                    "(" +
                                                    "person_id" +
                                                    ") " +
                                                    "VALUES " +
                                                    "(" +
                                                    "$1" +
                                                    ") " +
                                                    "RETURNING person_id, document_id", [personId])
                                                    .then(() => {
                                                        var params = {
                                                            Message: "Please go to the link to complete signup by entering " +
                                                            "this code when prompted <br/>" + password +
                                                            "<br/>http://34.200.245.26:3000/contact/form/mobile/member/" + inviteId + " ",
                                                            MessageStructure: 'STRING_VALUE',
                                                            PhoneNumber: '+1' + mobile,
                                                            Subject: 'Welcome to EQUIP.ME.NoT!',
                                                        };
                                                        sns.publish(params, function (err, data) {
                                                            if (err) {
                                                                console.log(err, err.stack);
                                                            }
                                                            else {
                                                                console.log("SMS code sent")
                                                                console.log(data);
                                                                res.status(200).json('success');
                                                            }
                                                        })
                                                    })
                                                    .catch(function (error) {
                                                        console.log("ERROR:", error);
                                                    })
                                            })
                                            .catch(function (error) {
                                                console.log("ERROR:", error);
                                            })
                                    })
                                    .catch(function (error) {
                                        console.log("ERROR:", error);
                                    })
                            })
                            .catch(function (error) {
                                console.log("ERROR:", error);
                            })
                    })
                    .catch(function (error) {
                        console.log("ERROR:", error);
                    })
            })
            .catch(function (error) {
                console.log("ERROR:", error);
            })
        })
})


router.post('/signup/information/mobile/extra/:invite_id', function (req, res) {
    var db = req.app.get('conn');
    var inviteId = req.params.invite_id;
    const {code} = req.body;
    db.one("SELECT * " +
        "FROM invite " +
        "WHERE invite_id = $1", inviteId)
        .then(invite => {
            console.log(invite.password);
            if (bcrypt.compareSync(code, invite.password)) {
                res.status(200).end();
            }
            else {
                res.status(400).json({form: 'Current Code Invalid'})
            }
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        })
})


router.post('/signup/information/mobile/:invite_id', function (req, res) {
    var db = req.app.get('conn');
    var inviteId = req.params.invite_id;
    const {email} = req.body;

    validateDuplicateInput(req.body, db, mobileContactFormValidation).then(({errors, isValid}) => {

        if (isValid) {

            db.task((t) => {
                return t.none('UPDATE invite ' +
                    'SET ' +
                    'onboarding_status = $1 ' +
                    'WHERE invite_id = $2', ['pending', inviteId])
                    .then(() => {
                        return t.one('UPDATE login l ' +
                            'SET ' +
                            'email = $1 ' +
                            'FROM invite i ' +
                            'WHERE l.login_id = i.login_id ' +
                            'AND i.invite_id = $2 ' +
                            'RETURNING l.login_id, email',
                            [email, inviteId])
                            .then(login => {
                                return t.one('UPDATE person ' +
                                    'SET ' +
                                    'email = $1 ' +
                                    'WHERE person.login_id = $2 ' +
                                    'RETURNING person_id',
                                    [email, login.login_id])
                                    .then(person => {
                                        return t.one('UPDATE contact ' +
                                            'SET ' +
                                            'emergency_first_name = $1, ' +
                                            'emergency_last_name = $2, ' +
                                            'emergency_phone = $3 ' +
                                            'WHERE person_id = $4 ' +
                                            'RETURNING person_id',
                                            [req.body.emergency_first_name, req.body.emergency_last_name, req.body.emergency_phone,
                                                person.person_id])
                                            .then(contact => {
                                                return t.one('UPDATE membership ' +
                                                    'SET ' +
                                                    'agreement_signed = $1 ' +
                                                    'WHERE person_id = $2 ' +
                                                    'RETURNING person_id',
                                                    [dateFormat(now, "isoDateTime"), contact.person_id])
                                                    .then(function (contact) {
                                                        console.log(contact.person_id);
                                                        res.status(200).end();
                                                    })
                                                    .catch(function (error) {
                                                        console.log("ERROR:", error.message || error);
                                                    })
                                            })
                                            .catch(function (error) {
                                                console.log("ERROR:", error.message || error);
                                            })
                                    })
                                    .catch(function (error) {
                                        console.log("ERROR:", error.message || error);
                                    })
                            })
                            .catch(function (error) {
                                console.log("ERROR:", error.message || error);
                            })
                    })
            })
                .then(params => ses.sendEmail({
                        Destination: {
                            ToAddresses: [
                                email
                            ]
                        },
                        Message: {
                            Body: {
                                Html: {
                                    Charset: "UTF-8",
                                    Data: "Please follow the link to finish your registration. Climb aboard! </br>" +
                                    "<a class=\"ulink\" href=\"http://34.200.245.26:3000/contact/form/email/member/" + inviteId + "\" " + "target=\"_blank\">EQUIP.ME.NoT Contact Info Page</a>.",
                                }
                            },
                            Subject: {
                                Charset: "UTF-8",
                                Data: "Welcome to EQUIP.ME.NoT"
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
                        }
                    })
                )
        }
        else {
            res.status(400).json(errors);
        }
    })

})



router.post('/signup/information/email/:invite_id', function (req, res) {
    var db = req.app.get('conn');
    var inviteId = req.params.invite_id;
    var medDate = req.body.medical_date;
    medDate = (medDate == '') ? null : medDate;
    var medClass = req.body.medical_class;
    medClass = (medClass == '') ? 'none' : medClass;
    validateDuplicateInput(req.body, db, emailContactFormValidation).then(({ errors, isValid}) => {

        if (isValid) {
            const {username, password} = req.body;

            //encrypt password
            const password_digest = bcrypt.hashSync(password, 10);

            db.task((t) => {
                return t.none('UPDATE invite ' +
                    'SET ' +
                    'onboarding_status = $1 ' +
                    'WHERE invite_id = $2', ['responded', inviteId])
                    .then(login => {
                        return t.one('UPDATE login l ' +
                            'SET ' +
                            'username = $1, ' +
                            'password = $2 ' +
                            'FROM invite i ' +
                            'WHERE l.login_id = i.login_id ' +
                            'AND i.invite_id = $3 ' +
                            'RETURNING l.login_id',
                            [username, password_digest, inviteId])
                            .then(login => {
                                return t.one('UPDATE person ' +
                                    'SET ' +
                                    'faa_certificate_number = $1, ' +
                                    'faa_certificate_desc = $2, ' +
                                    'dob = $3 ' +
                                    'WHERE login_id = $4 ' +
                                    'RETURNING person_id',
                                    [req.body.faa_certificate_number, req.body.faa_certificate_desc, req.body.dob, login.login_id])
                                    .then(person => {
                                        return t.one('UPDATE documentation ' +
                                            'SET ' +
                                            'medical_class = $1, ' +
                                            'medical_date = $2 ' +
                                            'WHERE person_id = $3 ' +
                                            'RETURNING person_id',
                                            [medClass, medDate, person.person_id,])
                                            .then(documentation => {
                                                return t.one('UPDATE contact ' +
                                                    'SET ' +
                                                    'address = $1, ' +
                                                    'city = $2, ' +
                                                    'state = $3, ' +
                                                    'country = $4, ' +
                                                    'zip = $5,' +
                                                    'phone = $6, ' +
                                                    'fax = $7 ' +
                                                    'WHERE contact.person_id = $8 ' +
                                                    'RETURNING person_id',
                                                    [req.body.address, req.body.city, req.body.state, req.body.country, req.body.zip, req.body.phone,
                                                        req.body.fax, documentation.person_id])
                                                    .then(function (contact) {
                                                        console.log(contact.person_id);
                                                        res.status(200).end();
                                                    })
                                                    .catch(function (error) {
                                                        console.log("ERROR:", error);
                                                    })

                                            })
                                            .catch(function (error) {
                                                console.log("ERROR:", error);
                                            })
                                    })
                                    .catch(function (error) {
                                        console.log("ERROR:", error);
                                    })
                            })
                            .catch(function (error) {
                                console.log("ERROR:", error);
                            })
                    })
                    .catch(function (error) {
                        console.log("ERROR:", error);
                    })
            })
        }
        else {
            res.status(400).json(errors);
        }
    })
});


// Add a Customer to Membership for a School | POST | /api/membership/:schoolid/:invite_id
router.post('/membership/invite/request/:personid/:schoolid', function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var personId = req.params.personid;
    var email = "";
    db.task((t) => {
        console.log("1");
        return t.one("SELECT s.notification_email " +
                    "FROM school s " +
                    "WHERE s.school_id = $1", [schoolId])
                    .then((school) => {
                        email = school.notification_email;
                        console.log(email);
                        console.log("2");
                        return t.none('INSERT ' +
                        'INTO invite ' +
                        '(' +
                        'onboarding_status, ' +
                        'school_id, ' +
                        'invite_sent, ' +
                        'login_id' +
                        ') ' +
                        'SELECT ' +
                        '$1, ' +
                        '$2, ' +
                        '$3, ' +
                        'login_id ' +
                        'FROM person ' +
                        'WHERE person_id = $4', ['responded', schoolId, true, personId])
                        .then(() => {
                            console.log("3");
                            return t.none("INSERT " +
                                "INTO membership " +
                                "(" +
                                "school_id, " +
                                "person_id, " +
                                "agreement_signed" +
                                ") " +
                                "VALUES " +
                                "(" +
                                "$1, " +
                                "$2, " +
                                "$3" +
                                ")", [schoolId, personId, dateFormat(now, "isoDateTime")])
                                        .then(() => ses.sendEmail({
                                    Destination: {
                                        ToAddresses: [
                                            email
                                        ]
                                    },
                                    Message: {
                                        Body: {
                                            Html: {
                                                Charset: "UTF-8",
                                                Data: "Please take a look at this new request to join your school membership! </br>" +
                                                "<a class=\"ulink\" href=\"http://34.200.245.26:3000/admin/" + " target=\"_blank\">Invites at the Admin Desk</a>.",
                                            }
                                        },
                                        Subject: {
                                            Charset: "UTF-8",
                                            Data: "New Membership Request"
                                        },

                                    },
                                    Source: "willie.witten@gmail.com"
                                }, function (err, data) {
                                    if (err) {
                                        console.log("email fucked")
                                        console.log(err, err.stack);
                                    }
                                    else {
                                        console.log("email sent to " + email);
                                        res.status(200).json("through");
                                        console.log(data);
                                    }
                                })
                            )
                        .catch(function (error) {
                            res.status(400).json({form: `ERROR: ${error.message}`});
                        })
                    })
                .catch(function (error) {
                    res.status(400).json({form: `ERROR: ${error.message}`});
                })
        })
        .catch(function (error) {
            res.status(400).json({form: `ERROR: ${error.message}`});
        })
    })
});

// Add a Customer to Membership for a School | POST | /api/membership/:schoolid/:invite_id
router.post('/membershit/invite/request/:personid/:schoolid', function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var personId = req.params.personid;
    var email = "";
    var send = false;
    db.tx((tex) => {
        var q1 = db.task((t) => {
            console.log("1");
            t.one("SELECT s.notification_email " +
                "FROM school s " +
                "WHERE s.school_id = $1", [schoolId])
                .then((school) => {
                    email = school.notification_email;
                    console.log(email);
                    console.log("2");
                    t.none('INSERT ' +
                        'INTO invite ' +
                        '(' +
                        'onboarding_status, ' +
                        'school_id, ' +
                        'invite_sent, ' +
                        'login_id' +
                        ') ' +
                        'SELECT ' +
                        '$1, ' +
                        '$2, ' +
                        '$3, ' +
                        'login_id ' +
                        'FROM person ' +
                        'WHERE person_id = $4', ['responded', schoolId, true, personId])
                        .then(() => {
                            console.log("3");
                            t.none("INSERT " +
                                "INTO membership " +
                                "(" +
                                "school_id, " +
                                "person_id, " +
                                "agreement_signed" +
                                ") " +
                                "VALUES " +
                                "(" +
                                "$1, " +
                                "$2, " +
                                "$3" +
                                ")", [schoolId, personId, dateFormat(now, "isoDateTime")])
                            })
                        })
                    })
                        ses.sendEmail({
                            Destination: {
                                ToAddresses: [
                                    email
                                ]
                            },
                            Message: {
                                Body: {
                                    Html: {
                                        Charset: "UTF-8",
                                        Data: "Please take a look at this new request to join your school membership! </br>" +
                                        "<a class=\"ulink\" href=\"http://34.200.245.26:3000/admin/" + " target=\"_blank\">Invites at the Admin Desk</a>.",
                                    }
                                },
                                Subject: {
                                    Charset: "UTF-8",
                                    Data: "New Membership Request"
                                },

                            },
                            Source: "willie.witten@gmail.com"
                        }, function (err, data) {
                            if (err) {
                                send = false;
                                console.log("error in email stage")
                                console.log(err, err.stack);
                                return false;
                            }
                            else {
                                send = true;
                                console.log("email sent to " + email);
                                console.log(data);
                                return true;
                            }
                        })
                if(send)
                {
                    return tex.batch([q1]);
                }
                else{
                    res.status(400).json({form: `ERROR: message}`});
                }
            })
        .then(function (data) {
            console.log("success")
            res.json(data)
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});

module.exports = router;