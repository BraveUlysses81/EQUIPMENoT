var app = require('express');
var router = app.Router();
var _ = require('lodash');
var authenticate = require('../middleware/authenticate');
var AWS = require('aws-sdk');
var s3 = new AWS.SES();

AWS.config.update({region:'us-east-1'});

AWS.config.credentials = new AWS.EC2MetadataCredentials({
    httpOptions: { timeout: 5000 }, // 5 second timeout
    maxRetries: 10, // retry 10 times
    retryDelayOptions: { base: 200 } // see AWS.Config for information
});


// Add new Documentation | POST | /api/documentation/:customerid
router.post('/documentation/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.one("INSERT " +
        "INTO documentation" +
        "(" +
            "medical_class, " +
            "medical_date, " +
            "rental_agreement, " +
            "written_test," +
            "renters_insurance, " +
            "guardian_release_form, " +
            "photo_id, " +
            "passport, " +
            "birth_certificate, " +
            "tsa_endorsement, " +
            "background_check, " +
            "firc, " +
            "person_id" +
        ")" +
        "VALUES" +
        "(" +
            "$1, " +
            "$2, " +
            "$3, " +
            "$4, " +
            "$5, " +
            "$6, " +
            "$7, " +
            "$8, " +
            "$9, " +
            "$10, " +
            "$11, " +
            "$12, " +
            "$13" +
        ") " +
        "RETURNING documentation", [req.body.medical_class, +
            req.body.medical_date, req.body.rental_agreement, req.body.written_test, req.body.renters_insurance, req.body.guardian_release_form, req.body.photo_id, req.body.passport, +
            req.body.birth_certificate, req.body.tsa_endorsement, req.body.background_check, req.body.firc, personId])
        .then(function (documentation) {
            //console.log(documentation);
            res.json(documentation)
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error); // print error;
        });
});

// Add new Documentation | PUT | /api/documentation/:customerid
router.put('/documentation/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.none("UPDATE documentation " +
        "SET " +
            "medical_class = $1, " +
            "medical_date = $2, " +
            "rental_agreement = $3, " +
            "faa_written_test_exp = $4," +
            "renters_insurance = $5, " +
            "guardian_release_form = $6, " +
            "photo_id = $7, " +
            "passport = $8, " +
            "birth_certificate = $9, " +
            "tsa_endorsement = $10, " +
            "background_check = $11, " +
            "firc = $12 " +
        "WHERE person_id = $13", [req.body.medical_class, req.body.medical_date, req.body.rental_agreement, req.body.faa_written_test_exp, req.body.renters_insurance, req.body.guardian_release_form, req.body.photo_id, req.body.passport, req.body.birth_certificate, req.body.tsa_endorsement, req.body.background_check, req.body.firc, personId]
    )
        .then(function () {
            res.status(200).json("success");
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error); // print error;
        });
});

router.put('/documentation/medicalupdate/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.none(
        'UPDATE documentation ' +
        'SET ' +
        'medical_class = $1, ' +
        'medical_date = $2 ' +
        'WHERE person_id = $3', [req.body.medical_class, req.body.medical_date, personId]
    )
        .then(function (documentation) {
        console.log(documentation);

    })
        .catch(function (error) {
            console.log("ERROR:", error.message || error); // print error;
        });
})

router.put('/documentation/profile/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;

    db.none(
        'UPDATE person ' +
        'SET ' +
        'picture_url = $1, ' +
        'WHERE person_id = $2', [req.body.picture_url, personId]
    )
        .then(function (profile) {
            console.log(profile);
            s

        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error); // print error;
        });
})


module.exports = router;