// $PM: I have only reviewed the js code.  I'll go and review the SQL now.

var app = require('express');
var router = app.Router();
var path = require('path');
var bcrypt = require('bcrypt');
var config  = require('./../config/config');
var _ = require('lodash');
var isEmpty = require('lodash/isEmpty');
var passwordValidation = require('./shared/passwordValidation');
var dateFormat = require('dateformat');
var now = new Date();
var validateDuplicateInput = require('./shared/validateDuplicateInput');
var contactValidation = require('./shared/contactValidation');
var authenticate = require('../middleware/authenticate');



router.get('/person/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.one("SELECT " +
            "p.first_name, " +
            "p.last_name, " +
            "p.dob, " +
            "p.regulation_type, " +
            "p.flight_review_date, " +
            "p.picture_url, " +
            "p.instruction_rate, " +
            "p.faa_certificate_number, " +
            "p.faa_certificate_desc, " +
            "p.faa_instructor_certificate_number, " +
            "p.mobile, " +
            "p.email AS customer_email, " +
            "ct.address, " +
            "ct.city, " +
            "ct.state, " +
            "ct.country, " +
            "ct.zip, " +
            "ct.phone, " +
            "ct.airnc, " +
            "ct.contact_type, " +
            "ct.primary_contact, " +
            "ct.fax, " +
            "ct.emergency_first_name, " +
            "ct.emergency_last_name, " +
            "ct.emergency_phone, " +
            "l.username, " +
            "l.email AS login_email, " +
            "l.is_validated, " +
            "l.requested_school, " +
            "l.createdat, " +
            "l.modifiedat " +
        "FROM person p " +
        "LEFT JOIN contact ct " +
        "ON (p.person_id = ct.person_id) " +
        "LEFT JOIN login l " +
        "ON (p.login_id = l.login_id) " +
        "WHERE p.person_id = $1", [personId])
        .then(function (data) {
            res.json(data)
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});


router.put('/person/:loginid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var loginId = req.params.loginid;
    var pars = passwordValidation(req.body);
    (function(chek, Id){
        if (chek) {
            console.log("this is Id " + Id);
            const {username, login_email, password} = req.body;
            const password_digest = bcrypt.hashSync(password, 10);
            db.task(t => {
                //console.log("this is Id inside the task " + Id);
                return t.one("UPDATE login " +
                    "SET " +
                    "username = $1, " +
                    "password = $2, " +
                    "email = $3, " +
                    "modifiedat = $4 " +
                    "WHERE login_id = $5 " +
                    "RETURNING login_id", [req.body.username, password_digest, req.body.login_email, dateFormat(now, "isoDateTime"), Id])
                    .then(login => {
                        return t.one("UPDATE person " +
                            "SET " +
                            "picture_url = $1, " +
                            "instruction_rate = $2 " +
                            "WHERE login_id = $3 " +
                            "RETURNING person_id", [req.body.picture_url, req.body.instruction_rate, login.login_id])
                                })
                            .then(person => {
                            return t.one("UPDATE contact " +
                                "SET " +
                                "address = $1, " +
                                "city = $2, " +
                                "state = $3, " +
                                "country = $4, " +
                                "zip = $5, " +
                                "phone = $6, " +
                                "mobile = $7, " +
                                "email = $8, " +
                                "airnc = $9, " +
                                "contact_type = $10, " +
                                "primary_contact = $11, " +
                                "fax = $12, " +
                                "emergency_first_name = $13, " +
                                "emergency_last_name = $14, " +
                                "emergency_phone = $15 " +
                                "WHERE person_id = $16 " +
                                "RETURNING person_id", [req.body.address, req.body.city, req.body.state, req.body.country, req.body.zip, req.body.phone,
                                req.body.mobile, req.body.contact_email, req.body.airnc, req.body.contact_type, req.body.primary_contact,
                                req.body.fax, req.body.emergency_first_name, req.body.emergency_last_name, req.body.emergency_phone, person.person_id])
                        })
                    .then(function (data) {
                        res.json(data)
                    })
                    .catch(function (error) {
                        console.log("ERROR:", error.message || error);
                    });
            });
        }
    })(pars.isValid, loginId);
});

// Return all Customers current or otherwise for a given school with basic information
// This route is not currently assigned to a position on the mock ups but it might be useful to see all customer records
router.get('/customers/all/:schoolid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    db.any("SELECT " +
        "p.person_id, " +
        "p.dob, " +
        "p.faa_certificate_desc, " +
        "p.faa_certificate_number, " +
        "p.faa_instructor_certificate_number, " +
        "p.first_name, " +
        "p.last_name, " +
        "p.flight_review_date, " +
        "p.instruction_rate, " +
        "p.login_id, " +
        "p.picture_url, " +
        "p.regulation_type, " +
        "p.mobile, " +
        "p.email, " +
        "ct.contact_id, " +
        "ct.address, " +
        "ct.airnc, " +
        "ct.city, " +
        "ct.country, " +
        "ct.emergency_first_name, " +
        "ct.emergency_last_name, " +
        "ct.emergency_phone, " +
        "ct.fax, " +
        "ct.phone, " +
        "ct.primary_contact, " +
        "ct.state, " +
        "ct.zip, " +
        "m.membership_id, " +
        "m.agreement_signed, " +
        "m.member_since, " +
        "m.membership_type, " +
        "m.school_id, " +
        "m.admin_view_rights, " +
        "m.dispatch_view_rights, " +
        "m.instructor_view_rights " +
        "FROM membership m " +
        "LEFT JOIN person p " +
        "ON (p.person_id = m.person_id)" +
        "LEFT JOIN contact ct " +
        "ON (p.person_id = ct.person_id) " +
        "WHERE 1 = 1 AND " +
        "m.school_id = $1 " +
        "AND (m.membership_type = 'student' " +
        "OR m.membership_type = 'renter') " +
        "ORDER BY p.last_name"
        , schoolId)
        .then(function (customer) {
            for (var num in customer) {
                var obj = customer[num];
                for (var key in obj) {
                    if (obj[key] == null) {
                        delete obj[key];
                    }
                }
            }
            res.json (customer)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });

});


router.get('/membership/checkouts/:membershipid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var membershipId = req.params.membershipid;
    db.any("SELECT " +
        "ch.checkout_id, " +
        "ch.aircraft_id, " +
        "ch.currency_end_date, " +
        "ch.ifr_checkout, " +
        "ch.membership_id, " +
        "m.membership_id, " +
        "m.admin_view_rights, " +
        "m.agreement_signed, " +
        "m.dispatch_view_rights, " +
        "m.instructor_view_rights, " +
        "m.member_since, " +
        "m.membership_type, " +
        "m.person_id, " +
        "m.school_id, " +
        "a.aircraft_id, " +
        "a.airbags, " +
        "a.aircraft_model_id, " +
        "a.aircraft_status, " +
        "a.auto_pilot, " +
        "a.currency_days, " +
        "a.dual_only, " +
        "a.elt_certification, " +
        "a.glass_cockpit, " +
        "a.gps, " +
        "a.gps_database_update, " +
        "a.hobbs, " +
        "a.hundred_hr_inspection, " +
        "a.ifr_certificate, " +
        "a.night_certificate, " +
        "a.parachute, " +
        "a.picture_url, " +
        "a.pitot_static_inspection, " +
        "a.registration_nbr, " +
        "a.school_id, " +
        "a.tach, " +
        "a.transponder_certification, " +
        "a.vor_check, " +
        "a.year, " +
        "am.aircraft_model_id, " +
        "am.aerobatic, " +
        "am.biplane, " +
        "am.category, " +
        "am.class, " +
        "am.classic, " +
        "am.complex, " +
        "am.engine, " +
        "am.faa_type_designation, " +
        "am.make, " +
        "am.model_id, " +
        "am.popular_name, " +
        "am.tailwheel, " +
        "am.turbo, " +
        "am.warbird " +
        "FROM checkout ch " +
        "LEFT JOIN membership m " +
        "ON (ch.membership_id = m.membership_id) " +
        "LEFT JOIN aircraft a " +
        "ON (ch.aircraft_id = a.aircraft_id) " +
        "INNER JOIN aircraft_model am " +
        "ON (a.aircraft_model_id = am.aircraft_model_id) " +
        "WHERE ch.membership_id = $1", membershipId)
        .then(function (checkouts) {
            for (var num in checkouts) {
                var obj = checkouts[num];
                for (var key in obj) {
                    if (obj[key] == null) {
                        delete obj[key];
                    }
                }
            }
            // }
            res.json(checkouts)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });

});


router.get('/membership/nots/:membershipid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var membershipId = req.params.membershipid;
    db.any("SELECT " +
        "ch.checkout_id, " +
        "a.aircraft_id, " +
        "a.airbags, " +
        "a.aircraft_model_id, " +
        "a.aircraft_status, " +
        "a.auto_pilot, " +
        "a.currency_days, " +
        "a.dual_only, " +
        "a.elt_certification, " +
        "a.glass_cockpit, " +
        "a.gps, " +
        "a.gps_database_update, " +
        "a.hobbs, " +
        "a.hundred_hr_inspection, " +
        "a.ifr_certificate, " +
        "a.night_certificate, " +
        "a.parachute, " +
        "a.picture_url, " +
        "a.pitot_static_inspection, " +
        "a.registration_nbr, " +
        "a.school_id, " +
        "a.tach, " +
        "a.transponder_certification, " +
        "a.vor_check, " +
        "a.year, " +
        "am.aircraft_model_id, " +
        "am.aerobatic, " +
        "am.biplane, " +
        "am.category, " +
        "am.class, " +
        "am.classic, " +
        "am.complex, " +
        "am.engine, " +
        "am.faa_type_designation, " +
        "am.make, " +
        "am.model_id, " +
        "am.popular_name, " +
        "am.tailwheel, " +
        "am.turbo, " +
        "am.warbird " +
        "FROM checkout ch " +
        "JOIN membership m " +
        "ON (ch.membership_id = m.membership_id) " +
        "RIGHT JOIN aircraft a " +
        "ON (a.aircraft_id = ch.aircraft_id) " +
        "LEFT JOIN aircraft_model am " +
        "ON (a.aircraft_model_id = am.aircraft_model_id) " +
        "WHERE " +
        "AND ch.membership_id = $1", [membershipId])
        .then(function (data) {
            res.json(data)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});


router.put('/customers/certificate/:customerid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.customerid;
    var category = _.pick(req.body, 'category', 'instrument_rating', 'high_performance', 'complex', 'tailwheel',
        'high_altitude', 'nvg', 'external_load', 'aero_tow', 'winch_launch');
    var pilot_certificate = _.pick(req.body, 'certificate_type', 'category_id', 'class');
    db.tx(function (t) {
        var q1 = this.one('UPDATE category ' +
            'SET category = $1, ' +
            'instrument_rating = $2, ' +
            'high_performance = $3, ' +
            'complex = $4, ' +
            'tailwheel = $5, ' +
            'high_altitude = $6, ' +
            'nvg = $7, ' +
            'external_load = $8, ' +
            'aero_tow = $9, ' +
            'winch_launch = $10 ' +
            'RETURNING category_id, ' +
            'category, ' +
            'instrument_rating, ' +
            'high_performance, ' +
            'complex, ' +
            'tailwheel, ' +
            'high_altitude, ' +
            'nvg, ' +
            'external_load, ' +
            'aero_tow, ' +
            'winch_launch ',
            [category.category, category.instrument_rating, category.high_performance, category.complex, category.tailwheel, category.high_altitude,
            category.nvg, category.external_load, category.aero_tow, category.winch_launch])
        var q2 = this.one('UPDATE pilot_category ' +
            'SET certificate_type = $1, ' +
            'category_id = $2, ' +
            'class = $3, ' +
            'person_id = $4 ' +
            'RETURNING pilot_category_id, ' +
            'certificate_type, ' +
            'category_id, ' +
            'class, ' +
            'person_id ',
            [pilot_certificate.certificate_type, pilot_certificate.category_id, pilot_certificate.class, personId]);
        return t.batch([q1, q2]);
    })
        .then(function (data) {
            //console.log(data);
            res.json(data)
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});

//UPDATE customer information | PUT | for the customer
//This route is used to update information for the customer in both the CUSTOMER and the CONTACT table
//It is called when an instructor clicks on the "Edit Customer Details" tab in the "Customer Window"
router.put('/customers/contact/:customerid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.customerid;
    console.log(req.body)
    var person = _.pick(req.body, 'first_name', 'last_name', 'mobile', 'email', 'dob', 'regulation_type', 'flight_review_date',
        'picture_url', 'instruction_rate');
    var contact = _.pick(req.body, 'contact_id', 'address', 'city', 'state', 'country', 'zip', 'phone',
        'email', 'airnc', 'contact_type', 'primary_contact', 'fax', 'emergency_first_name', 'emergency_last_name', 'emergency_phone');

    console.log(typeof person);
    db.tx(function (t) {
        var q1 = this.one('UPDATE person ' +
            'SET first_name = $1, ' +
            'last_name = $2, ' +
            'mobile = $3, ' +
            'email = $4, ' +
            'dob = $5, ' +
            'regulation_type = $6, ' +
            'flight_review_date = $7, ' +
            'picture_url = $8, ' +
            'instruction_rate = $9 ' +
            'WHERE person_id = $10 ' +
            'RETURNING person_id, ' +
            'first_name, ' +
            'last_name, ' +
            'mobile, ' +
            'email, ' +
            'dob, ' +
            'regulation_type, ' +
            'flight_review_date, ' +
            'picture_url, ' +
            'instruction_rate ',
            [person.first_name, person.last_name, person.mobile, person.email, person.dob, person.regulation_type, person.flight_review_date, person.picture_url, person.instruction_rate, personId]);
        var q2 = this.one('UPDATE contact ' +
            'SET address = $1, ' +
            'city = $2, ' +
            'state = $3, ' +
            'country = $4, ' +
            'zip = $5, ' +
            'phone = $6, ' +
            'airnc = $7, ' +
            'contact_type = $8, ' +
            'primary_contact = $9, ' +
            'fax = $10, ' +
            'emergency_first_name = $11, ' +
            'emergency_last_name = $12, ' +
            'emergency_phone = $13 ' +
            'WHERE person_id = $14 ' +
            'RETURNING contact_id, ' +
            'address, ' +
            'city, ' +
            'state, ' +
            'country, ' +
            'zip, ' +
            'phone, ' +
            'airnc, ' +
            'contact_type, ' +
            'primary_contact, ' +
            'fax, ' +
            'emergency_first_name, ' +
            'emergency_last_name, ' +
            'emergency_phone, ' +
            'person_id',
            [contact.address, contact.city, contact.state, contact.country, contact.zip, contact.phone, +
                contact.airnc, contact.contact_type, contact.primary_contact, contact.fax, contact.emergency_first_name, contact.emergency_last_name, contact.emergency_phone, personId]);
        return t.batch([q1, q2]);
    })
        .then(function (data) {
            // var per = data[0];
            // var con = data[1];
            //
            // for (var k in per){
            //     if (per.hasOwnProperty(k)) {
            //         if (per[k] === null){
            //             per[k] = "";
            //         }
            //         //console.log("Key is " + k + ", value is " + per[k]);
            //     }
            // }
            //
            // for (var k in con){
            //     if (con.hasOwnProperty(k)) {
            //         if (con[k] === null){
            //             con[k] = "";
            //         }
            //         //console.log("Key is " + k + ", value is " + con[k]);
            //     }
            // }
            res.json(data)
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});

//route to update user address, city, state, zip, countery from profile page
router.put('/customers/profile/address', authenticate, function (req, res) {
    var db = req.app.get('conn');

    var customer = _.pick(req.body, 'person_id', 'address', 'city',
        'state', 'country', 'zip');

    db.none('UPDATE contact ' +
            'SET address = $1, ' +
            'city = $2, ' +
            'state = $3, ' +
            'zip = $4, ' +
            'country = $5 ' +
            'WHERE person_id = $6',
            [customer.address, customer.city, customer.state, customer.zip, customer.country, customer.person_id ])
        .then(function (data) {
            res.status(200).json('success')
        })
        .catch(function (error) {
            res.status(401).json({ form: ' An error has occured, data not saved'})
        });
});

//route to update user emergency contact info from profile page
router.put('/customers/profile/emergencycontact', authenticate, function (req, res) {
    var db = req.app.get('conn');

    var customer = _.pick(req.body, 'person_id', 'emergency_first_name', 'emergency_last_name',
        'emergency_phone');

    db.none('UPDATE contact ' +
        'SET emergency_first_name = $1, ' +
        'emergency_last_name = $2, ' +
        'emergency_phone = $3 ' +
        'WHERE person_id = $4',
        [customer.emergency_first_name, customer.emergency_last_name, customer.emergency_phone, customer.person_id ])
        .then(function (data) {
            res.status(200).json('success')
        })
        .catch(function (error) {
            res.status(401).json({ form: ' An error has occured, data not saved'})
        });
});

//post route to update contact and login info
router.post('/customers/profile/contact', authenticate, function (req, res) {
    var db = req.app.get('conn');

    const { checkDuplicate, first_name, last_name, mobile, email, person_id, username, phone, fax } = req.body;

    //remove dashes from phone numbers
    let contactPhone = phone.replace(/-/g, '');
    let contactMobile = mobile.replace(/-/g, '');
    let contactFax = fax.replace(/-/g, '');

    if(checkDuplicate == 'true') {
        validateDuplicateInput(req.body, db, contactValidation).then(({errors, isValid}) => {
            if(isValid) {
                db.task((t) => {
                    return t.one("SELECT p.login_id " +
                        "FROM person p " +
                        "WHERE p.person_id = $1", [person_id])
                        .then(person => {
                            db.none('UPDATE login ' +
                            'SET username = $1,' +
                            'email = $2 ' +
                            'WHERE login_id = $3', [username, email, person.login_id]);
                        })
                    })
            } else {
                res.status(400).json(errors);
            }
        })
        .catch((err) => {
            res.status(400).json({ form: err.response });
        })
    }

    db.none('UPDATE person ' +
        'SET first_name = $1, ' +
        'last_name = $2, ' +
        'mobile = $3, ' +
        'email = $4 ' +
        'WHERE person_id = $5',
        [first_name, last_name, contactMobile, email, person_id])
        .then(() => {
                db.none('UPDATE contact ' +
                    'SET phone = $1, ' +
                    'fax = $2 ' +
                    'WHERE person_id = $3',
                    [contactPhone, contactFax, person_id])
            })
        .then(() => {
            res.status(200).json('success');
        })
        .catch((err) => {
                res.status(400).json({ form: err.response });
        })
});

// Add a new Customer with Contact Information | POST | /api/customers/contact/login/:loginid
// This post route is used to add a customer with options to add information in the CUSTOMER and CONTACT table
// It's called when the "red +" button is chosen along with an "invite a new customer"
router.post('/customers/contact/login/:loginid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var loginId = req.params.loginid;

    var person = _.pick(req.body, 'first_name', 'last_name', 'dob', 'regulation_type', 'flight_review_date', 'picture_url', 'instruction_rate',
        'faa_certificate_number', 'faa_certificate_desc', 'faa_instructor_certificate_number', 'login_id');
    var contact = _.pick(req.body, 'address', 'city', 'state', 'country', 'zip', 'phone', 'mobile', 'email',
        'airnc', 'contact_type', 'primary_contact', 'fax', 'emergency_first_name', 'emergency_last_name');
    db.tx(function (t) {
        var q1 = this.one('INSERT ' +
            'INTO person ' +
            '(first_name, last_name, dob, regulation_type, flight_review_date, picture_url, instruction_rate, ' +
            'faa_certificate_number, faa_certificate_desc, faa_instructor_certificate_number, login_id) ' +
            'VALUES ' +
            '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
            'RETURNING person_id, first_name, last_name, dob, regulation_type, flight_review_date, login_id',
            [person.first_name, person.last_name, person.dob, person.regulation_type, person.flight_review_date, person.picture_url,
                person.instruction_rate, person.faa_certificate_number, person.faa_certificate_desc, person.faa_instructor_certificate_number, loginId]);
        var q2 = this.one('INSERT ' +
            'INTO contact ' +
            '(address, city, state, country, zip, phone, mobile, email, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name, ' +
            'emergency_phone, airport_id, school_id, person_id) ' +
            'VALUES ' +
            '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) ' +
            'RETURNING contact_id, address, city, state, country, zip, phone, mobile, email, airnc, contact_type, primary_contact, fax, emergency_first_name, emergency_last_name',
            [contact.address, contact.city, contact.state, contact.country, contact.zip, contact.phone, contact.mobile, contact.email,
                contact.airnc, contact.contact_type, contact.primary_contact, contact.fax, contact.emergency_first_name, contact.emergency_last_name,
                contact.emergency_phone, contact.airport_id, contact.school_id, contact.person_id]);
        return t.batch([q1, q2]);
    })
        .then(function (data) {
            //console.log(data);
            res.json(data)
            var personId = data[0].person_id;
            var contactId = data[1].contact_id;
            db.any('UPDATE contact SET person_id = $1 WHERE contact_id = $2', [personId, contactId]);
        })
        .catch(function (error) {
            // $PM : if an error occurred, should you send back a 4** http code so that the client knows and can
            //       do something else?  Possibly error.message as well so the browser shows what happened?
            //       Message should be shown only in development mode.  Read about ERROR HANDLING in ExpressJS docs.

            // $PM : instead of console.log, try console.error
            console.log("ERROR:", error.message || error);
        });
});

router.get('/member/studentendorsements/:membershipid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var membershipId = req.params.membershipid;
    db.any(
        'SELECT ' +
        'se.student_endorsement_id, ' +
        'se.student_solo, ' +
        'se.aircraft_id, ' +
        'se.instructor_id, ' +
        'se.student_endorsement_end_date, ' +
        'a.registration_nbr ' +
        'FROM student_endorsements se ' +
        'LEFT JOIN aircraft a ' +
        'ON (se.aircraft_id = a.aircraft_id) ' +
        'WHERE membership_id = $1', membershipId
    )
        .then(function(solo){
            res.json(solo)

        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
})

router.put('/member/studentendorsement/:membershipid/:aircraftid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var membershipId = req.params.membershipid;
    var aircraftId = req.params.aircraftid;
    db.one
    db.task(t => {
        return t.one(

                'UPDATE student_endorsements ' +
                'SET ' +
                'student_endorsement_end_date = $1 ' +
                'WHERE membership_id = $2 ' +
                'AND aircraft_id = $3 ' +
                'RETURNING student_endorsement_id', [req.body.student_endorsement_end_date, membershipId, aircraftId]
            )
            .then(aircraft => {
                return t.one(
                    'SELECT * ' +
                    'FROM aircraft a ' +
                    'LEFT JOIN aircraft_model am ' +
                    'ON (a.aircraft_model_id = am.aircraft_model_id) ' +
                    'WHERE a.aircraft_id = $1 ', aircraftId
                )
                    .then(solo => {
                        return t.any(
                            'SELECT * ' +
                            'FROM aircraft a ' +
                            'LEFT JOIN aircraft_model am ' +
                            'ON (a.aircraft_model_id = am.aircraft_model_id) ' +
                            'WHERE a.school_id = $1 ' +
                            'AND am.faa_type_designation = $2 ' +
                            'AND a.glass_cockpit = $3 ' +
                            'AND am.complex = $4 ' +
                            'AND am.tailwheel = $5 ' +
                            'AND am.engine =$6 ' +
                            'AND a.aircraft_id != $7', [solo.school_id, solo.faa_type_designation, solo.glass_cockpit, solo.complex, solo.tailwheel, solo.engine, aircraftId]
                        )

                    })
            })

    })
        .then(function (solos) {
            for (i = 0; i < solos.length; i++) {
                db.none(
                    'UPDATE student_endorsements ' +
                    'SET ' +
                    'student_endorsement_end_date = $1 ' +
                    'WHERE membership_id = $2 ' +
                    'AND aircraft_id = $3 ', [req.body.student_endorsement_end_date, membershipId, solos[i].aircraft_id]
                )
            }
        })
        .catch(function (error) {
            console.log("ERROR:", error);

        })

        .then(function (updatesolos) {
            console.log (updatesolos)
            res.json(updatesolos)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });

});


router.post('/member/studentendorsements/:membershipid', authenticate, function (req, res) {

    var db = req.app.get('conn');
    var membershipId = req.params.membershipid;
    db.task(t => {
        return t.one(
            'INSERT INTO student_endorsements ' +
            '(aircraft_id, ' +
            'instructor_id, ' +
            'membership_id, ' +
            'student_endorsement_end_date, ' +
            'student_solo) ' +
            'VALUES ' +
            '($1, ' +
            '$2, ' +
            '$3, ' +
            '$4, ' +
            '$5) ' +
            'RETURNING aircraft_id', [req.body.aircraft_id, req.body.instructor_id, membershipId, req.body.student_endorsement_end_date, true]
        )
            .then(aircraft => {
                return t.one(
                    'SELECT * ' +
                    'FROM aircraft a ' +
                    'LEFT JOIN aircraft_model am ' +
                    'ON (a.aircraft_model_id = am.aircraft_model_id) ' +
                    'WHERE a.aircraft_id = $1 ', aircraft.aircraft_id
                )
                    .then(solo => {
                        return t.any(
                            'SELECT * ' +
                            'FROM aircraft a ' +
                            'LEFT JOIN aircraft_model am ' +
                            'ON (a.aircraft_model_id = am.aircraft_model_id) ' +
                            'WHERE a.school_id = $1 ' +
                            'AND am.faa_type_designation = $2 ' +
                            'AND a.glass_cockpit = $3 ' +
                            'AND am.complex = $4 ' +
                            'AND am.tailwheel = $5 ' +
                            'AND am.engine =$6 ' +
                            'AND a.aircraft_id != $7', [solo.school_id, solo.faa_type_designation, solo.glass_cockpit, solo.complex, solo.tailwheel, solo.engine, solo.aircraft_id]
                        )

                    })
            })
    })

        .then(function (solos) {
            for (i = 0; i < solos.length; i++) {
                db.none(
                    'INSERT INTO student_endorsements ' +
                    '(aircraft_id, ' +
                    'instructor_id, ' +
                    'membership_id, ' +
                    'student_endorsement_end_date, ' +
                    'student_solo) ' +
                    'VALUES ' +
                    '($1, ' +
                    '$2, ' +
                    '$3, ' +
                    '$4, ' +
                    '$5)'
                    , [solos[i].aircraft_id, req.body.instructor_id, membershipId, req.body.student_endorsement_end_date, true]
                )
            }
        })
        .catch(function (error) {
            console.log("ERROR:", error);

        })
        .then(function (newsolos) {
            console.log (newsolos)
            res.status(200).end();
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
})


module.exports = router;