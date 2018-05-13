

var app = require('express');
var router = app.Router();
var _ = require('lodash');
var dateFormat = require('dateformat');
var now = new Date();
var bcrypt = require('bcrypt');
var validateDuplicateInput = require('./shared/validateDuplicateInput');
var contactValidation = require('./shared/contactValidation');
var emailContactFormValidation = require('./shared/emailContactFormValidation');
var authenticate = require('../middleware/authenticate');
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

//return all documents by person_id
router.get('/membership/documents/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.any('SELECT ' +
        'p.person_id, ' +
        'p.dob, ' +
        'p.faa_certificate_desc, ' +
        'p.faa_certificate_number, ' +
        'p.faa_instructor_certificate_number, ' +
        'p.first_name, ' +
        'p.flight_review_date, ' +
        'p.instruction_rate, ' +
        'p.last_name, ' +
        'p.login_id, ' +
        'p.picture_url, ' +
        'p.regulation_type, ' +
        'd.document_id, ' +
        'd.medical_class, ' +
        'd.medical_date, ' +
        'd.rental_agreement, ' +
        'd.faa_written_test_exp, ' +
        'd.renters_insurance, ' +
        'd.guardian_release_form, ' +
        'd.photo_id, ' +
        'd.passport, ' +
        'd.birth_certificate, ' +
        'd.tsa_endorsement, ' +
        'd.background_check, ' +
        'd.firc ' +
        'FROM person p ' +
        'LEFT JOIN documentation d ' +
        'ON (p.person_id = d.person_id) ' +
        'WHERE p.person_id = $1' , personId)
        .then(function (documentation) {
            if (documentation[0].document_id === null){
                documentation[0].document_id = 'NO DOCUMENTATION';
            }
            var obj = documentation[0];
            for (var key in obj){
                if (obj[key] == null) {
                    delete obj[key];
                }
            }
            res.json(documentation)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});

//
router.post('/membership/accept/:schoolid/:loginid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var loginId = req.params.loginid;

    db.task((t) => {
        return t.any('SELECT ' +
        'p.* ' +
        'FROM person p ' +
        'JOIN login l ' +
        'ON (p.login_id = $1)', loginId)
            .then(person => {
                return t.any("INSERT " +
                    "INTO membership " +
                    "(" +
                    "membership_type, " +
                    "person_id, " +
                    "school_id, " +
                    "agreement_signed, " +
                    "member_since, " +
                    "instructor_view_rights, " +
                    "dispatch_view_rights, " +
                    "admin_view_rights" +
                    ") " +
                    "VALUES " +
                    "(" +
                    "$1, " +
                    "$2, " +
                    "$3, " +
                    "$4, " +
                    "$5, " +
                    "$6, " +
                    "$7, " +
                    "$8" +
                    ")", [req.body.membership_type, person[0].person_id, schoolId, req.body.agreement_signed,
                    dateFormat(now, "isoDateTime"), req.body.instructor_view_rights, req.body.dispatch_view_rights,
                    req.body.admin_view_rights])
                })
        })
        .then(function (flight) {
            res.json(flight);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
})

//return all memberships for a single person
router.get('/memberships/all/:person_id', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var person_id = req.params.person_id;
    db.any("SELECT " +
                "m.membership_type, " +
                "s.school_id, " +
                "s.school_name, " +
                "s.school_logo, " +
                "m.membership_id " +
            "FROM membership m " +
            "JOIN SCHOOL s " +
            "ON (s.school_id = m.school_id) " +
            "WHERE m.person_id = $1 " +
            "AND m.member_view_rights = $2", [person_id, true])
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        })
})

//return all schools a single person is not a member
router.get('/memberships/schools/nonmember/:person_id', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var person_id = req.params.person_id;

    db.any("SELECT " +
        "s.school_id, s.school_name, s.school_logo " +
        "FROM school s " +
        "WHERE NOT EXISTS " +
        "(SELECT m.person_id FROM membership m WHERE s.school_id = m.school_id AND m.person_id = $1) " +
        "OR EXISTS (SELECT m.person_id FROM membership m WHERE s.school_id = m.school_id AND member_view_rights = $2)", [person_id, false])
        .then((schools) => {
            res.json(schools);
        })
        .catch((err) => {
            console.log(err);
        })
})

//return all memberships for a school that have dispatch and admin rights
router.get('/memberships/roles/all/:school_id', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var school_id = req.params.school_id;
    db.any("SELECT " +
        "m.member_view_rights, m.instructor_view_rights, m.dispatch_view_rights, m.admin_view_rights, " +
        "p.person_id, p.first_name, p.last_name, l.username " +
        "FROM membership m " +
        "JOIN PERSON p " +
        "ON (p.person_id = m.person_id) " +
        "JOIN login l " +
        "ON (l.login_id = p.login_id) " +
        "WHERE m.school_id = $1 AND m.member_view_rights = $2", [school_id, true])
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        })
})

//update permissions (view_rights) for an individual member
router.put('/membership/permissions/:school_id/:person_id', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.school_id;
    var personId = req.params.person_id;
    var user = req.body;

    db.any("UPDATE membership " +
        "SET member_view_rights = $1, instructor_view_rights = $2, " +
        "dispatch_view_rights = $3, admin_view_rights = $4 " +
        "WHERE person_id = $5 AND school_id = $6", [user.member_view_rights, user.instructor_view_rights, user.dispatch_view_rights,
        user.admin_view_rights, personId, schoolId]
    )
        .then(function () {
            res.status(200).json('success');
        })
        .catch(function (err) {
            res.status(400).json({ err });
        })
})

router.get('/membership/invite/status/:inviteId', function (req, res) {
        var db = req.app.get('conn');
        var inviteId = req.params.inviteId;

        db.one("SELECT " +
            "i.onboarding_status " +
            "FROM invite i " +
            "WHERE i.invite_id = $1", [inviteId])
        .then(status => {
            if (status) {
                res.status(200).json(status);
            } else {
                res.status(400).json({ form: 'Status not located' });
            }
        })
        .catch((err) => {
            res.status(400).json({ form: err });
        })
});

// Add a Customer to Membership for a School | POST | /api/membership/:schoolid/:invite_id
router.post('/membership/invite/:schoolid/:inviteid', function (req, res) {
    var db = req.app.get('conn');
    var inviteId = req.params.inviteid;

    const { regulation_type, person_id, tsa_endorsement } = req.body;

    db.task((t) => {
        return t.none('UPDATE invite ' +
            'SET ' +
            'onboarding_status = $1 ' +
            'WHERE invite_id = $2', ['accepted', inviteId])
            .then(() => {
                return t.none("UPDATE person " +
                    "SET " +
                    "regulation_type = $1 " +
                    "WHERE person_id = $2",
                    [regulation_type, person_id])
                    .then(() => {
                        return t.none("UPDATE documentation " +
                            "SET " +
                            "tsa_endorsement = $1 " +
                            "WHERE person_id = $2",
                            [tsa_endorsement, person_id])
                            .then(() => {
                                return t.none( "UPDATE membership " +
                                    "SET " +
                                    "member_view_rights = $1 " +
                                    "WHERE person_id = $2",
                                    [true, person_id])
                                    .then(() => {
                                        res.status(200).json("success");
                                    })
                                    .catch(function (error) {
                                        res.status(400).json({form: `ERROR: ${error.message}`});
                                    })
                            })
                    })

            })
            .catch(function (error) {
                res.status(400).json({form: `ERROR: ${error.message}`});
            })
    })
});

//route to get person information for school to approve an invite
router.get('/membership/invite/:inviteId', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var inviteId = req.params.inviteId;

    db.one("SELECT " +
        "p.first_name, " +
        "p.last_name, " +
        "p.dob, " +
        "p.regulation_type, " +
        "p.flight_review_date, " +
        "p.instruction_rate, " +
        "p.faa_certificate_number, " +
        "p.faa_certificate_desc, " +
        "p.faa_instructor_certificate_number, " +
        "p.mobile, " +
        "p.person_id, " +
        "ct.address, " +
        "ct.city, " +
        "ct.state, " +
        "ct.country, " +
        "ct.zip, " +
        "ct.phone, " +
        "ct.fax, " +
        "ct.emergency_first_name, " +
        "ct.emergency_last_name, " +
        "ct.emergency_phone, " +
        "d.medical_class, " +
        "d.tsa_endorsement, " +
        "m.agreement_signed, " +
        "m.school_id, " +
        "l.email, " +
        "i.onboarding_status " +
        "FROM person p " +
        "LEFT JOIN contact ct " +
        "ON (p.person_id = ct.person_id) " +
        "LEFT JOIN documentation d " +
        "ON (p.person_id = d.person_id) " +
        "LEFT JOIN membership m " +
        "ON (p.person_id = m.person_id) " +
        "LEFT JOIN login l " +
        "ON (p.login_id = l.login_id) " +
        "LEFT JOIN invite i " +
        "ON (l.login_id = i.login_id) " +
        "WHERE i.invite_id = $1 AND i.onboarding_status = 'responded' AND i.school_id = m.school_id", inviteId)
        .then(function (data) {
            res.json(data)
        })
        .catch(function (error) {
            res.status(400).json({ form: error.message || 'Connection error' })
        })
});

//get all invites by school
router.get('/membership/invites/all/:schoolid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    db.any('SELECT ' +
        'i.invite_id, ' +
        'i.onboarding_status, ' +
        'i.login_id, ' +
        'i.invite_sent, ' +
        'l.username, ' +
        'l.email, ' +
        'p.first_name, ' +
        'p.last_name ' +
        'FROM invite i ' +
        'LEFT JOIN login l ' +
        'ON (i.login_id = l.login_id) ' +
        'LEFT JOIN person p ' +
        'ON (l.login_id = p.login_id) ' +
        'WHERE i.school_id = $1 AND i.onboarding_status != $2', [schoolId, 'accepted'])
        .then(function (school) {
            res.json(school);
        })
        .catch(function (err) {
            res.status(400).json({ err });
        });
});


module.exports = router;