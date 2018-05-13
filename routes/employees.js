var app = require('express');
var router = app.Router();
var _ = require('lodash');
var authenticate = require('../middleware/authenticate');


//Return all the instructors for a school
router.get('/school/instructors/:schoolid', authenticate, function (req, res) {
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
        "ct.person_id, " +
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
        "m.person_id, " +
        "m.school_id, " +
        "m.admin_view_rights, " +
        "m.dispatch_view_rights, " +
        "m.instructor_view_rights, " +
        'ic.instructor_certificate_id, ' +
        'ic.single_engine_instructor, ' +
        'ic.instrument_instructor, ' +
        'ic.multi_engine_instructor, ' +
        'ic.basic_ground_instructor, ' +
        'ic.advanced_ground_instructor, ' +
        'ic.instrument_ground_instructor, ' +
        'ic.helicopter_instructor, ' +
        'ic.sport_pilot_instructor ' +
        "FROM person p " +
        "LEFT JOIN contact ct " +
        "ON (p.person_id = ct.person_id) " +
        "LEFT JOIN membership m " +
        "ON (p.person_id = m.person_id) " +
        "LEFT JOIN instructor_certificate ic " +
        "ON (p.person_id = ic.person_id) " +
        "WHERE m.school_id = $1 " +
        "AND m.membership_type = 'instructor' " +
        "ORDER BY p.last_name ", schoolId)
        .then(function (data) {
            //console.log (data);
            for (var num in data) {
                var obj = data[num];
                for (var key in obj) {
                    if (obj[key] == null) {
                        delete obj[key];
                    }
                }
            }
            for (let i of data){
                if (i.single_engine_instructor === true){
                    i.single_engine_instructor = 'CFI';
                }
                if (i.instrument_instructor === true){
                    i.instrument_instructor = 'CFII';
                }
                if (i.multi_engine_instructor === true){
                    i.multi_engine_instructor = 'CFI-MEI';
                }
                if (i.basic_ground_instructor === true){
                    i.basic_ground_instructor = 'BGI';
                }
                if (i.advanced_ground_instructor === true){
                    i.advanced_ground_instructor = 'AGI';
                }
                if (i.instrument_ground_instructor === true){
                    i.instrument_ground_instructor = 'BGI';
                }
                if (i.helicopter_instructor === true){
                    i.helicopter_instructor = 'HI';
                }
                if (i.sport_pilot_instructor === true){
                    i.sport_pilot_instructor = 'SPI';
                }
            }
                res.json (data);
            })
            .catch(function (error) {
                console.log("ERROR:", error);
            })
    });




// get a single instructor at given school id
router.get('/instructors/:schoolid/:instructorid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var instructorId = req.params.instructorid;
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
        "ct.person_id, " +
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
        "m.person_id, " +
        "m.school_id, " +
        "m.admin_view_rights, " +
        "m.dispatch_view_rights, " +
        "m.instructor_view_rights, " +
        "ic.instructor_certificate_id, " +
        "ic.single_engine_instructor, " +
        "ic.instrument_instructor, " +
        "ic.multi_engine_instructor, " +
        "ic.basic_ground_instructor, " +
        "ic.advanced_ground_instructor, " +
        "ic.instrument_ground_instructor, " +
        "ic.helicopter_instructor, " +
        "ic.sport_pilot_instructor " +
        "FROM person p " +
        "LEFT JOIN contact ct " +
        "ON (p.person_id = ct.person_id)" +
        "LEFT JOIN membership m " +
        "ON (p.person_id = m.person_id) " +
        "LEFT JOIN instructor_certificate ic " +
        "ON (p.person_id = ic.person_id) " +
        "WHERE 1 = 1 " +
        "AND m.school_id = $1 " +
        "AND p.person_id = $2", [schoolId, instructorId])
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

router.get('/instructor/documents/:instructorid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var instructorId = req.params.instructorid;
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
        'd.firc, ' +
        'ic.instructor_certificate_id, ' +
        'ic.single_engine_instructor, ' +
        'ic.instrument_instructor, ' +
        'ic.multi_engine_instructor, ' +
        'ic.basic_ground_instructor, ' +
        'ic.advanced_ground_instructor, ' +
        'ic.instrument_ground_instructor, ' +
        'ic.helicopter_instructor, ' +
        'ic.sport_pilot_instructor ' +
        'FROM person p ' +
        'LEFT JOIN documentation d ' +
        'ON (p.person_id = d.person_id) ' +
        'LEFT JOIN instructor_certificate ic ' +
        'ON (p.person_id = ic.person_id) ' +
        'WHERE p.person_id = $1', instructorId)
        .then(function (documents) {
            if (documents[0].instructor_certificate_id === null){
                documents[0].instructor_certificate_id = 'NO CERTIFICATION';
            }
            if (documents[0].document_id === null){
                documents[0].document_id = 'NO DOCUMENTATION';
            }
            if (documents[0].single_engine_instructor === true){
                documents[0].single_engine_instructor = 'CFI';
            }
            if (documents[0].instrument_instructor === true){
                documents[0].instrument_instructor = 'CFII';
            }
            if (documents[0].multi_engine_instructor === true){
                documents[0].multi_engine_instructor = 'CFI-MEI';
            }
            if (documents[0].basic_ground_instructor === true){
                documents[0].basic_ground_instructor = 'BGI';
            }
            if (documents[0].advanced_ground_instructor === true){
                documents[0].advanced_ground_instructor = 'AGI';
            }
            if (documents[0].instrument_ground_instructor === true){
                documents[0].instrument_ground_instructor = 'BGI';
            }
            if (documents[0].helicopter_instructor === true){
                documents[0].helicopter_instructor = 'HI';
            }
            if (documents[0].sport_pilot_instructor === true){
                documents[0].sport_pilot_instructor = 'SPI';
            }

            var obj = documents[0];
            for (var key in obj){
                if (obj[key] == null) {
                    delete obj[key];
                }
            }
            res.json(documents);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});



router.get('/pilot/pilot_certificate/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.any('SELECT ' +
        'pc.pilot_certificate_id, ' +
        'pc.certificate_type, ' +
        'pc.class, ' +
        'pc.person_id, ' +
        'pc.aero_tow, ' +
        'pc.category, ' +
        'pc.complex, ' +
        'pc.external_load, ' +
        'pc.high_altitude, ' +
        'pc.high_performance, ' +
        'pc.instrument_rating, ' +
        'pc.nvg, ' +
        'pc.tailwheel, ' +
        'pc.winch_launch ' +
        'FROM pilot_certificate pc ' +
        'WHERE pc.person_id = $1 ' +
        'ORDER BY pc.category', personId)
        .then(function (certificate) {
            res.json(certificate);

        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
})

router.get('/instructor/instructorcertificate/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.one(
        'SELECT ' +
        'instructor_certificate_id, ' +
        'single_engine_instructor, ' +
        'instrument_instructor, ' +
        'multi_engine_instructor, ' +
        'basic_ground_instructor, ' +
        'advanced_ground_instructor, ' +
        'instrument_ground_instructor, ' +
        'helicopter_instructor, ' +
        'sport_pilot_instructor ' +
        'FROM instructor_certificate ' +
        'WHERE person_id = $1', personId
    )
        .then(function (certificate) {
            res.json(certificate);

        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
})

router.put('/instructor/:instructorid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var instructorId = req.params.instructorid;
    var person = _.pick(req.body, 'first_name', 'last_name', 'dob', 'regulation_type', 'flight_review_date',
        'picture_url', 'instruction_rate');
    var contact = _.pick(req.body, 'contact_id', 'address', 'city', 'state', 'country', 'zip', 'phone', 'mobile',
        'email', 'airnc', 'contact_type', 'primary_contact', 'fax', 'emergency_first_name', 'emergency_last_name', 'emergency_phone');

    console.log(typeof person);
    db.tx(function (t) {
        var q1 = this.one('UPDATE person ' +
            'SET first_name = $1, ' +
            'last_name = $2, ' +
            'dob = $3, ' +
            'regulation_type = $4, ' +
            'flight_review_date = $5, ' +
            'picture_url = $6, ' +
            'instruction_rate = $7 ' +
            'WHERE person_id = $8 ' +
            'RETURNING person_id, ' +
            'first_name, ' +
            'last_name, ' +
            'dob, ' +
            'regulation_type, ' +
            'flight_review_date, ' +
            'picture_url, ' +
            'instruction_rate ',
            [person.first_name, person.last_name, person.dob, person.regulation_type, person.flight_review_date, person.picture_url, person.instruction_rate, instructorId]);
        var q2 = this.one('UPDATE contact ' +
            'SET address = $1, ' +
            'city = $2, ' +
            'state = $3, ' +
            'country = $4, ' +
            'zip = $5, ' +
            'phone = $6, ' +
            'mobile = $7, ' +
            'email = $8, ' +
            'airnc = $9, ' +
            'contact_type = $10, ' +
            'primary_contact = $11, ' +
            'fax = $12, ' +
            'emergency_first_name = $13, ' +
            'emergency_last_name = $14, ' +
            'emergency_phone = $15 ' +
            'WHERE person_id = $16 ' +
            'RETURNING contact_id, ' +
            'address, ' +
            'city, ' +
            'state, ' +
            'country, ' +
            'zip, ' +
            'phone, ' +
            'mobile, ' +
            'email, ' +
            'airnc, ' +
            'contact_type, ' +
            'primary_contact, ' +
            'fax, ' +
            'emergency_first_name, ' +
            'emergency_last_name, ' +
            'emergency_phone, ' +
            'person_id',
            [contact.address, contact.city, contact.state, contact.country, contact.zip, contact.phone, contact.mobile, contact.email, +
                contact.airnc, contact.contact_type, contact.primary_contact, contact.fax, contact.emergency_first_name, contact.emergency_last_name, contact.emergency_phone, instructorId]);
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

router.post('/pilot/pilotcertificate/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');

    var personId = req.params.personid;
    var cert = _.pick(req.body, 'category', 'certificate_type', 'class', 'instrument_rating', 'high_performance', 'complex', 'tailwheel', 'high_altitude', 'nvg', 'external_load', 'aero_tow', 'winch_launch');
    db.one('INSERT ' +
            'INTO ' +
            'pilot_certificate ' +
            '(category, ' +
            'certificate_type, ' +
            'class, ' +
            'person_id, ' +
            'instrument_rating, ' +
            'high_performance, ' +
            'complex, ' +
            'tailwheel, ' +
            'high_altitude, ' +
            'nvg, ' +
            'external_load, ' +
            'aero_tow, ' +
            'winch_launch) ' +
            'VALUES ' +
            '($1, ' +
            '$2, ' +
            '$3, ' +
            '$4, ' +
            '$5, ' +
            '$6, ' +
            '$7, ' +
            '$8, ' +
            '$9, ' +
            '$10, ' +
            '$11, ' +
            '$12, ' +
            '$13) ' +
            'RETURNING pilot_certificate_id', [cert.category, cert.certificate_type, cert.class, personId, cert.instrument_rating, cert.high_performance, cert.complex, cert.tailwheel, cert.high_altitude, cert.nvg, cert.external_load, cert.aero_tow, cert.winch_launch])
            .then(function (data) {
                console.log(data);
                res.json(data);
            })
            .catch(function (error) {
                console.log("ERROR:", error.message || error);
            });

})

router.put('/pilotcertificate/endorsements/:pilotcertificateid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var pilotCertificateId = req.params.pilotcertificateid;
    var cert = _.pick(req.body, 'instrument_rating', 'high_performance', 'complex', 'tailwheel', 'high_altitude', 'nvg', 'external_load', 'aero_tow', 'winch_launch');

    db.any('UPDATE ' +
        'pilot_certificate ' +
        'SET ' +
        'instrument_rating = $1, ' +
        'high_performance = $2, ' +
        'complex = $3, ' +
        'tailwheel = $4, ' +
        'high_altitude = $5, ' +
        'nvg = $6, ' +
        'external_load = $7, ' +
        'aero_tow = $8, ' +
        'winch_launch = $9 ' +
        'WHERE ' +
        'pilot_certificate_id = $10 ' +
        'RETURNING ' +
        'pilot_certificate', [ cert.instrument_rating, cert.high_performance, cert.complex, cert.tailwheel, cert.high_altitude, cert.nvg, cert.external_load, cert.aero_tow, cert.winch_launch, pilotCertificateId])
        .then(function (data) {
            //console.log(data);
            res.json(data);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
})

router.post('/instructor/instructorcertificate/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    var instructorCert = _.pick(req.body, 'advanced_ground_instructor', 'basic_ground_instructor', 'helicopter_instructor', 'instrument_ground_instructor', 'instrument_instructor', 'multi_engine_instructor', 'single_engine_instructor', 'sport_pilot_instructor');
    db.one('INSERT INTO ' +
        'instructor_certificate ' +
        '(advanced_ground_instructor, ' +
        'basic_ground_instructor, ' +
        'helicopter_instructor, ' +
        'instrument_ground_instructor, ' +
        'instrument_instructor, ' +
        'multi_engine_instructor, ' +
        'single_engine_instructor, ' +
        'sport_pilot_instructor, ' +
        'person_id) ' +
        'VALUES ' +
        '($1, ' +
        '$2, ' +
        '$3, ' +
        '$4, ' +
        '$5, ' +
        '$6, ' +
        '$7, ' +
        '$8, ' +
        '$9) ' +
        'RETURNING instructor_certificate_id, person_id', [instructorCert.advanced_ground_instructor, instructorCert.basic_ground_instructor, instructorCert.helicopter_instructor, instructorCert.instrument_ground_instructor, instructorCert.instrument_instructor, instructorCert.multi_engine_instructor, instructorCert.single_engine_instructor, instructorCert.sport_pilot_instructor, personId])
        .then(function (instCert) {
            res.json(instCert);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
})

router.put('/instructorcertificate/:instructorcertificateid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var instructorCertId = req.params.instructorcertificateid;
    var instructorCert = _.pick(req.body, 'advanced_ground_instructor', 'basic_ground_instructor', 'helicopter_instructor', 'instrument_ground_instructor', 'instrument_instructor', 'multi_engine_instructor', 'single_engine_instructor', 'sport_pilot_instructor');

    db.one(
        'UPDATE ' +
        'instructor_certificate ' +
        'SET ' +
        'advanced_ground_instructor = $1, ' +
        'basic_ground_instructor = $2, ' +
        'helicopter_instructor = $3, ' +
        'instrument_ground_instructor = $4, ' +
        'instrument_instructor = $5, ' +
        'multi_engine_instructor = $6, ' +
        'single_engine_instructor = $7, ' +
        'sport_pilot_instructor = $8 ' +
        'WHERE instructor_certificate_id = $9 ' +
        'RETURNING instructor_certificate_id, person_id', [instructorCert.advanced_ground_instructor, instructorCert.basic_ground_instructor, instructorCert.helicopter_instructor, instructorCert.instrument_ground_instructor, instructorCert.instrument_instructor, instructorCert.multi_engine_instructor, instructorCert.single_engine_instructor, instructorCert.sport_pilot_instructor, instructorCertId]

    )
    .then(function (instCert) {
        res.json(instCert);
    })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
})

module.exports = router;