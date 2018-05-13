var app = require('express');
var router = app.Router();
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config  = require('./../config/config');
var signupValidation = require('./shared/signupValidation');
var validateDuplicateInput = require('./shared/validateDuplicateInput');
var webEmailContactFormValidation = require('./shared/webEmailContactFormValidation');
var isEmpty = require('lodash/isEmpty');
var validator = require('validator');
var dateFormat = require('dateformat');
var now = new Date();
var AWS = require('aws-sdk');
var ses = new AWS.SES();

AWS.config.update({region:'us-east-1'});

AWS.config.credentials = new AWS.EC2MetadataCredentials({
    httpOptions: { timeout: 20000 }, // 5 second timeout
    maxRetries: 10, // retry 10 times
    retryDelayOptions: { base: 200 } // see AWS.Config for information
});



// router.post('/signup/information/email/:invite_id', function (req, res) {
//     var db = req.app.get('conn');
//     var inviteId = req.params.invite_id;
//     var medDate = req.body.medical_date;
//     medDate = (medDate == '') ? null : medDate;
//     var medClass = req.body.medical_class;
//     medClass = (medClass == '') ? 'none' : medClass;
//     var schoolId = "";
//
//     validateDuplicateInput(req.body, db, webEmailContactFormValidation).then(({ errors, isValid}) => {
//
//         if (isValid) {
//
//             db.task((t) => {
//                 return t.one('UPDATE invite i ' +
//                     'SET ' +
//                     'onboarding_status = $1 ' +
//                     'WHERE i.invite_id = $2 ' +
//                     'RETURNING i.invite_id, school_id',
//                     ['responded', inviteId])
//                     .then(invite => {
//                         schoolId = invite.school_id;
//                         return t.one('UPDATE person p ' +
//                             'SET ' +
//                             'faa_certificate_number = $1, ' +
//                             'faa_certificate_desc = $2, ' +
//                             'dob = $3 ' +
//                             'FROM login l ' +
//                             'JOIN invite i ' +
//                             'ON l.login_id = i.login_id ' +
//                             'WHERE i.invite_id = $4 ' +
//                             'AND p.login_id = l.login_id ' +
//                             'RETURNING person_id',
//                             [req.body.faa_certificate_number, req.body.faa_certificate_desc, req.body.dob, inviteId])
//                             .then(person => {
//                                 return t.one("INSERT " +
//                                     "INTO documentation " +
//                                     "(" +
//                                     "medical_class, " +
//                                     "medical_date, " +
//                                     "person_id" +
//                                     ") " +
//                                     "VALUES " +
//                                     "(" +
//                                     "$1, " +
//                                     "$2, " +
//                                     "$3" +
//                                     ") " +
//                                     "RETURNING person_id, document_id",
//                                     [medClass, medDate, person.person_id,])
//                                     .then(documentation => {
//                                         return t.one("INSERT " +
//                                             "INTO contact " +
//                                             "(address, " +
//                                             "city, " +
//                                             "state, " +
//                                             "country, " +
//                                             "zip, " +
//                                             "phone, " +
//                                             "fax, " +
//                                             "person_id" +
//                                             ") " +
//                                             "VALUES " +
//                                             "(" +
//                                             "$1, " +
//                                             "$2, " +
//                                             "$3, " +
//                                             "$4, " +
//                                             "$5, " +
//                                             "$6, " +
//                                             "$7, " +
//                                             "$8" +
//                                             ") " +
//                                             "RETURNING person_id, contact_id",
//                                             [req.body.address, req.body.city, req.body.state, req.body.country, req.body.zip, req.body.phone,
//                                                 req.body.fax, documentation.person_id])
//                                             .then(contact => {
//                                                 return t.one("INSERT " +
//                                                     "INTO membership " +
//                                                     "(" +
//                                                     "person_id, " +
//                                                     "school_id, " +
//                                                     "member_since" +
//                                                     ") " +
//                                                     "VALUES " +
//                                                     "(" +
//                                                     "$1, " +
//                                                     "$2, " +
//                                                     "$3" +
//                                                     ") " +
//                                                     "RETURNING person_id, school_id",
//                                                     [contact.person_id, schoolId, dateFormat(now, "isoDateTime")])
//                                                         .then(function (contact) {
//                                                             console.log(contact.person_id);
//                                                             res.status(200).end();
//                                                         })
//                                                         .catch(function (error) {
//                                                             console.log("ERROR:", error);
//                                                         })
//                                                 })
//                                             .catch(function (error) {
//                                                 console.log("ERROR:", error);
//                                             })
//
//                                     })
//                                     .catch(function (error) {
//                                         console.log("ERROR:", error);
//                                     })
//                             })
//                             .catch(function (error) {
//                                 console.log("ERROR:", error);
//                             })
//                     })
//                     .catch(function (error) {
//                         console.log("ERROR:", error);
//                     })
//
//             })
//
//         }
//         else {
//             res.status(400).json(errors);
//         }
//     })
// })

module.exports = router;