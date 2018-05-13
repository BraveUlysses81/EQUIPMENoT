
var app = require('express');
var router = app.Router();
var _ = require('lodash');
var dateFormat = require('dateformat');
var now = new Date();
var authenticate = require('../middleware/authenticate');
var twilio = require('twilio');
var client = new twilio('AC2f7541578b8701c7c0ef07046825f867', '48a80b5dc1806c8d9d9b18c3afd54bbb');
var http = require('http');


router.get('/school/flights/:schoolid/:aircraftregnum', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var aircraftRegNum = req.params.aircraftregnum;
    db.any("SELECT * FROM aircraft_flights_vw " +
        "WHERE school_id = $1 " +
        "AND registration_nbr = $2 AND flight_status <> 'cancelled'", [schoolId, aircraftRegNum])
        .then(function (flight) {
            // for (var num in flight) {
            //     var obj = flight[num];
            //     for (var key in obj) {
            //         if (obj[key] == null) {
            //             delete obj[key];
            //         }
            //     }
            // }
            res.json (flight)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});



//get all dispatched flights for a aircraft registration nbr
router.post('/school/flights/dispatched/:schoolid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var registration_nbr = req.body.registration_nbr;

    db.any("SELECT f.flight_id, f.customer_id, c.first_name as customer_first_name, c.last_name as customer_last_name, " +
            "i.first_name as instructor_first_name, i.last_name as instructor_last_name " +
            "FROM flight f " +
            "LEFT JOIN aircraft a " +
            "ON (f.aircraft_id = a.aircraft_id) " +
            "LEFT JOIN person i " +
            "ON (f.instructor_id = i.person_id) " +
            "LEFT JOIN person c " +
            "ON (f.customer_id = c.person_id) " +
            "WHERE f.school_id = $1 AND a.registration_nbr = $2 AND f.flight_status = 'pinned'", [schoolId, registration_nbr])
        .then(function (flight) {
            for (var num in flight) {
                var obj = flight[num];
                for (var key in obj) {
                    if (obj[key] == null) {
                        delete obj[key];
                    }
                }
            }
            //if no instructor name returned set to empty string
            flight.map(i => {
                if(!i.instructor_first_name) {
                    i.instructor_first_name = '';
                }
                if(!i.instructor_last_name) {
                    i.instructor_last_name = '';
                }
            })
            res.json (flight)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});


// Show a Single Flight | GET | /api/flight/detail/:flightid
router.get('/flight/detail/:flightid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var flightId = req.params.flightid;
    db.one(
        "SELECT f.flight_id, " +
        "f.flight_creation_time, " +
        "f.va_pre_post, " +
        "f.no_show, " +
        "f.beginning_tach, " +
        "f.end_tach, " +
        "f.billable_ground_hrs, " +
        "f.cross_country, " +
        "f.invoice_id, " +
        "f.dispatch_time, " +
        "f.dispatched_by, " +
        "f.sms_release_id, " +
        "f.sms_complete_id, " +
        "f.flight_status, " +
        "f.flight_type, " +
        "customer.person_id AS customer_id, " +
        "customer.first_name AS customer_first, " +
        "customer.last_name AS customer_last, " +
        "customer.dob AS customer_dob, " +
        "customer.regulation_type AS customer_regulation_type, " +
        "customer.flight_review_date AS customer_flight_review, " +
        "customer.picture_url AS customer_picture, " +
        "customer.faa_certificate_number AS customer_faa_certificate_number, " +
        "customer.faa_certificate_desc AS customer_faa_certificate_desc, " +
        "customer.login_id AS customer_login_id, " +
        "customer.mobile AS customer_mobile, " +
        "customer.email AS customer_email, " +
        "instructor.person_id AS instructor_id, " +
        "instructor.first_name AS instructor_first, " +
        "instructor.last_name AS instructor_last, " +
        "instructor.dob AS instructor_dob, " +
        "instructor.regulation_type AS instructor_regulation_type, " +
        "instructor.flight_review_date AS instructor_flight_review, " +
        "instructor.picture_url AS instructor_picture, " +
        "instructor.instruction_rate, " +
        "instructor.faa_certificate_number AS instructor_faa_certificate_number, " +
        "instructor.faa_certificate_desc AS instructor_faa_certificate_desc, " +
        "instructor.faa_instructor_certificate_number, " +
        "instructor.login_id AS instructor_login_id, " +
        "a.aircraft_id, " +
        "a.registration_nbr, " +
        "a.school_id, " +
        "a.dual_only, " +
        "a.year, " +
        "a.hobbs, " +
        "a.tach, " +
        "a.ifr_certificate, " +
        "a.night_certificate, " +
        "a.hundred_hr_inspection, " +
        "a.pitot_static_inspection, " +
        "a.transponder_certification, " +
        "a.elt_certification, " +
        "a.vor_check, " +
        "a.gps_database_update, " +
        "a.glass_cockpit, " +
        "a.gps, " +
        "a.auto_pilot, " +
        "a.airbags, " +
        "a.parachute, " +
        "a.aircraft_model_id, " +
        "a.currency_days, " +
        "a.picture_url AS aircraft_picture_url, " +
        "a.aircraft_status, " +
        "am.aircraft_model_id, " +
        "am.faa_type_designation, " +
        "am.category, " +
        "am.class, " +
        "am.make, " +
        "am.model_id, " +
        "am.popular_name, " +
        "am.engine, " +
        "am.turbo, " +
        "am.complex, " +
        "am.aerobatic, " +
        "am.tailwheel, " +
        "am.warbird, " +
        "am.biplane, " +
        "am.classic, " +
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
        "ic.instructor_certificate_id, " +
        "ic.single_engine_instructor, " +
        "ic.instrument_instructor, " +
        "ic.multi_engine_instructor, " +
        "ic.basic_ground_instructor, " +
        "ic.advanced_ground_instructor, " +
        "ic.instrument_ground_instructor, " +
        "ic.helicopter_instructor, " +
        "ic.sport_pilot_instructor, " +
        "m.membership_id AS customer_membership_id, " +
        "ch.checkout_id, " +
        "ch.currency_end_date, " +
        "ch.ifr_checkout " +
        "FROM flight f " +
        "LEFT JOIN aircraft a " +
        "ON (f.aircraft_id = a.aircraft_id) " +
        "LEFT JOIN aircraft_model am " +
        "ON (a.aircraft_model_id = am.aircraft_model_id) " +
        "LEFT JOIN person customer " +
        "ON (f.customer_id = customer.person_id) " +
        "LEFT JOIN person instructor " +
        "ON (f.instructor_id = instructor.person_id) " +
        "LEFT JOIN contact ct " +
        "ON (ct.person_id = customer.person_id) " +
        "LEFT JOIN instructor_certificate ic " +
        "ON (instructor.person_id = ic.person_id) " +
        "LEFT JOIN membership m " +
        "ON (f.customer_id = m.person_id) " +
        "LEFT JOIN checkout ch " +
        "ON (m.membership_id = ch.membership_id AND f.aircraft_id = ch.aircraft_id) " +
        "WHERE 1 = 1 " +
        "AND f.flight_id = $1", [flightId]
    )
        .then(function (flight){
            // console.log(flight);
            if (flight.aircraft_picture_url == ''){
                flight.aircraft_picture_url = "no photo";
            }
            if (flight.aircraft_picture_url == null){
                flight.aircraft_picture_url = "no photo";
            }
            if (flight.single_engine_instructor === true){
                flight.single_engine_instructor = 'CFI';
            }
            if (flight.single_engine_instructor == null) {
                flight.single_engine_instructor = '';
            }
            if (flight.instrument_instructor === true){
                flight.instrument_instructor = 'CFII';
            }
            if (flight.instrument_instructor == null){
                flight.instrument_instructor = '';
            }
            if (flight.multi_engine_instructor === true){
                flight.multi_engine_instructor = 'CFI-MEI';
            }
            if (flight.multi_engine_instructor == null){
                flight.multi_engine_instructor = '';
            }
            if (flight.basic_ground_instructor === true){
                flight.basic_ground_instructor = 'BGI';
            }
            if (flight.basic_ground_instructor == null){
                flight.basic_ground_instructor = '';
            }
            if (flight.advanced_ground_instructor === true){
                flight.advanced_ground_instructor = 'AGI';
            }
            if (flight.advanced_ground_instructor == null){
                flight.advanced_ground_instructor = '';
            }
            if (flight.instrument_ground_instructor === true){
                flight.instrument_ground_instructor = 'BGI';
            }
            if (flight.instrument_ground_instructor == null){
                flight.instrument_ground_instructor = '';
            }
            if (flight.helicopter_instructor === true){
                flight.helicopter_instructor = 'HI';
            }
            if (flight.helicopter_instructor == null){
                flight.helicopter_instructor = '';
            }
            if (flight.sport_pilot_instructor === true){
                flight.sport_pilot_instructor = 'SPI';
            }
            if (flight.sport_pilot_instructor == null){
                flight.sport_pilot_instructor = '';
            }
            if (flight.instructor_first == null) {
                flight.instructor_first = 'Solo';
            }
            if (flight.instructor_last == null) {
                flight.instructor_last = '';
            }
            res.json (flight);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});

// DISPATCH A FLIGHT | POST | /flight/:schoolid/:aircraftid
router.post('/flight/:schoolid/:aircraftid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var aircraftId = req.params.aircraftid;
    db.task(t => {
        db.one("SELECT a.tach " +
            "FROM aircraft a " +
            "WHERE a.aircraft_id = $1", [aircraftId])
            .then(aircraft => {
                db.any("INSERT " +
                    "INTO flight" +
                    "(" +
                    "va_pre_post, " +
                    "no_show, " +
                    "beginning_tach, " +
                    "cross_country, " +
                    "customer_id, " +
                    "instructor_id, " +
                    "flight_type, " +
                    "school_id, " +
                    "aircraft_id" +
                    ") VALUES" +
                    "(" +
                    "$1, " +
                    "$2, " +
                    "$3, " +
                    "$4, " +
                    "$5, " +
                    "$6, " +
                    "$7, " +
                    "$8, " +
                    "$9 " +
                    ") " +
                    "RETURNING flight_id, flight_creation_time, aircraft_id, va_pre_post, no_show, beginning_tach, cross_country, customer_id, " +
                    "instructor_id, school_id, flight_status, flight_type", [req.body.va_pre_post, req.body.no_show, aircraft.tach, req.body.cross_country,
                    req.body.customer_id, req.body.instructor_id, req.body.flight_type, schoolId, aircraftId])
                    .then(function (flight) {
                        res.json(flight);
                    })
                    .catch(function (error) {
                        console.log("ERROR:", error.message || error);
                    });
            })
            .catch(function (error) {
                console.log("ERROR:", error.message || error);
            });
    });
});

// Dispatch A Flight, Edit a Flight | PUT | /api/flight/release/:flightid
router.put('/flight/release/:flightid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var flightId = req.params.flightid;
    var mobile = "";
        db.one("SELECT p.mobile " +
            "FROM person p " +
            "JOIN flight f " +
            "ON (f.customer_id = p.person_id) " +
            "WHERE f.flight_id = $1", [flightId])
            .then(person => {
                mobile = person.mobile;
                console.log("this is the mobile number: " + mobile);
                db.one("UPDATE aircraft a " +
                    "SET aircraft_status = $1 " +
                    "FROM flight f " +
                    "WHERE a.aircraft_id = f.aircraft_id " +
                    "AND f.flight_id = $2 " +
                    "RETURNING hobbs, tach, registration_nbr", ['active', flightId])
                    .then(aircraft => {
                        client.messages.create({
                            body: `EQUIP.ME.NoT Dispatch Alert. ${aircraft.registration_nbr} ` +
                            `current times are: ` +
                            `Hobbs: ${aircraft.hobbs} ` +
                            `Tach: ${aircraft.tach} ` +
                            `Text Y to confirm and view recent squawks`,
                            to: mobile,  // Text this number
                            from: `+15126972692` // From a valid Twilio number
                            })
                            .then(message => {
                                db.one("UPDATE flight " +
                                    "SET " +
                                    "va_pre_post = $1, " +
                                    "no_show = $2, " +
                                    "dispatch_time = $3, " +
                                    "dispatched_by = $4, " +
                                    "flight_type = $5, " +
                                    "flight_status = $6 " +
                                    "WHERE flight_id = $7 " +
                                    "RETURNING flight_id, dispatch_time", [req.body.va_pre_post, req.body.no_show,
                                    dateFormat(now, "isoDateTime"), req.body.dispatched_by, req.body.flight_type, 'dispatched', flightId])
                                })
                                .then(function (flight) {
                                console.log("Are we in the success? ");
                                res.json("success");
                            })
                            .catch(function (error) {
                                console.log("are we in the error? ")
                                console.log("ERROR:", error.message || error);
                            });
                    })
                    .catch(function (error) {
                        console.log("ERROR:", error.message || error);
                    });
            })
            .catch(function (error) {
                console.log("ERROR:", error.message || error);
            })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});


router.put('/flight/inflight/:flightid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var flightId = req.params.flightid;
    db.task(t => {
        return t.none("UPDATE aircraft a " +
            "SET aircraft_status = $1 " +
            "FROM flight f " +
            "WHERE a.aircraft_id = f.aircraft_id " +
            "AND f.flight_id = $2", ['active', flightId])
            .then(aircraft => {
                return t.none("UPDATE flight " +
                    "SET " +
                    "flight_status = $1 " +
                    "WHERE flight_id = $2", ['in_flight', flightId])
            })
            .then(flight => {
                return t.one("INSERT INTO " +
                    "leg " +
                    "(" +
                    "flight_id, " +
                    "beginning_hobbs" +

                    ") VALUES " +
                    "(" +
                    "$1, " +
                    "$2) " +
                    "RETURNING leg_id", [flightId, req.body.beginning_hobbs])
            })
    })
        .then(function (flight) {
            res.json(flight);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});


router.put('/flight/complete/:flightid', authenticate, function (req, res){

    var db = req.app.get('conn');
    var flightId = req.params.flightid;
    db.task(t => {
        return t.one("UPDATE aircraft a " +
            "SET aircraft_status = $1 " +
            "FROM flight f " +
            "WHERE a.aircraft_id = f.aircraft_id " +
            "AND f.flight_id = $2 " +
            "RETURNING flight_id", ['flight_line', flightId])
            .then(flight => {
                //console.log(flight);
                return t.none("UPDATE flight " +
                    "SET " +
                    "flight_status = $1 " +
                    "WHERE flight_id = $2", ['completed', flightId])
            })
    })
        .then(function (flight) {
            res.json(flight);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});


router.get('/flight/close/:flightid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var flightId = req.params.flightid;
    db.one("SELECT * FROM (" +
    "SELECT f.flight_id, "+
        "l.leg_id, " +
        "f.flight_id, " +
        "f.flight_creation_time, " +
        "f.va_pre_post, " +
        "f.no_show, " +
        "f.beginning_tach, "+
        "f.end_tach, " +
        "f.billable_ground_hrs, " +
        "f.cross_country, " +
        "f.invoice_id, " +
        "f.dispatch_time, " +
        "f.dispatched_by, " +
        "f.sms_release_id, " +
        "f.sms_complete_id, " +
        "customer.person_id AS customer_id, " +
        "customer.first_name AS customer_first, " +
        "customer.last_name AS customer_last, " +
        "customer.dob AS customer_dob, " +
        "customer.regulation_type AS customer_regulation_type, " +
        "customer.flight_review_date AS customer_flight_review, " +
        "customer.picture_url AS customer_picture, " +
        "customer.faa_certificate_number AS customer_faa_certificate_number, " +
        "customer.faa_certificate_desc AS customer_faa_certificate_desc, " +
        "customer.login_id AS customer_login_id, " +
        "customer.mobile, " +
        "customer.email, " +
        "instructor.person_id AS instructor_id, " +
        "instructor.first_name AS instructor_first, " +
        "instructor.last_name AS instructor_last, " +
        "instructor.dob AS instructor_dob, " +
        "instructor.regulation_type AS instructor_regulation_type, " +
        "instructor.flight_review_date AS instructor_flight_review, " +
        "instructor.picture_url AS instructor_picture, " +
        "instructor.instruction_rate, " +
        "instructor.faa_certificate_number AS instructor_faa_certificate_number, " +
        "instructor.faa_certificate_desc AS instructor_faa_certificate_desc, " +
        "instructor.faa_instructor_certificate_number, " +
        "instructor.login_id AS instructor_login_id, " +
        "a.aircraft_id, " +
        "a.registration_nbr, " +
        "a.school_id, " +
        "a.dual_only, " +
        "a.year, " +
        "a.hobbs, " +
        "a.tach, " +
        "a.ifr_certificate, " +
        "a.night_certificate, " +
        "a.hundred_hr_inspection, " +
        "a.pitot_static_inspection, " +
        "a.transponder_certification, " +
        "a.elt_certification, " +
        "a.vor_check, " +
        "a.gps_database_update, " +
        "a.glass_cockpit, " +
        "a.gps, " +
        "a.auto_pilot, " +
        "a.airbags, " +
        "a.parachute, " +
        "a.aircraft_model_id, " +
        "a.currency_days, " +
        "a.picture_url AS aircraft_picture_url, " +
        "a.aircraft_status, " +
        "am.aircraft_model_id, " +
        "am.faa_type_designation, " +
        "am.category, " +
        "am.class, " +
        "am.make, " +
        "am.model_id, " +
        "am.popular_name, " +
        "am.engine, " +
        "am.turbo, " +
        "am.complex, " +
        "am.aerobatic, " +
        "am.tailwheel, " +
        "am.warbird, " +
        "am.biplane, " +
        "am.classic, " +
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
        "ch.checkout_id, " +
        "ch.currency_end_date, " +
        "ch.ifr_checkout, " +
        "ic.instructor_certificate_id, " +
        "ic.single_engine_instructor, " +
        "ic.instrument_instructor, " +
        "ic.multi_engine_instructor, " +
        "ic.basic_ground_instructor, " +
        "ic.advanced_ground_instructor, " +
        "ic.instrument_ground_instructor, " +
        "ic.helicopter_instructor, " +
        "ic.sport_pilot_instructor, " +
        "first_value(l.beginning_hobbs) over (partition by l.flight_id order by l.leg_id) as beginning_hobbs, " +
        "last_value(l.end_hobbs)        over (partition by f.flight_id order by l.end_hobbs NULLS LAST ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) as ending_hobbs, " +
        "row_number()                   over (partition by f.flight_id order by l.leg_id desc) as rownum, " +
        "f.flight_status, " +
        "f.flight_type " +
    "FROM flight f  JOIN leg l " +
    "ON (f.flight_id = l.flight_id) " +
    "LEFT JOIN aircraft a " +
    "ON (f.aircraft_id = a.aircraft_id) " +
    "LEFT JOIN aircraft_model am " +
    "ON (a.aircraft_model_id = am.aircraft_model_id) " +
    "LEFT JOIN squawk sq " +
    "ON (sq.aircraft_id = a.aircraft_id) " +
    "LEFT JOIN person customer " +
    "ON (f.customer_id = customer.person_id) " +
    "LEFT JOIN person instructor " +
    "ON (f.instructor_id = instructor.person_id) " +
    "LEFT JOIN contact ct " +
    "ON (ct.person_id = customer.person_id) " +
    "LEFT JOIN instructor_certificate ic " +
    "ON (instructor.person_id = ic.person_id) " +
    "LEFT JOIN checkout ch " +
    "ON (ch.aircraft_id = a.aircraft_id) " +
    "WHERE 1 = 1 " +
    "AND f.flight_id = $1) AS RESULT WHERE rownum = 1;", [flightId])
        .then(function (flight){
            // console.log(flight);
            if (flight.aircraft_picture_url == ''){
                flight.aircraft_picture_url = "no photo";
            }
            if (flight.aircraft_picture_url == null){
                flight.aircraft_picture_url = "no photo";
            }
            if (flight.single_engine_instructor === true){
                flight.single_engine_instructor = 'CFI';
            }
            if (flight.single_engine_instructor == null) {
                flight.single_engine_instructor = '';
            }
            if (flight.instrument_instructor === true){
                flight.instrument_instructor = 'CFII';
            }
            if (flight.instrument_instructor == null){
                flight.instrument_instructor = '';
            }
            if (flight.multi_engine_instructor === true){
                flight.multi_engine_instructor = 'CFI-MEI';
            }
            if (flight.multi_engine_instructor == null){
                flight.multi_engine_instructor = '';
            }
            if (flight.basic_ground_instructor === true){
                flight.basic_ground_instructor = 'BGI';
            }
            if (flight.basic_ground_instructor == null){
                flight.basic_ground_instructor = '';
            }
            if (flight.advanced_ground_instructor === true){
                flight.advanced_ground_instructor = 'AGI';
            }
            if (flight.advanced_ground_instructor == null){
                flight.advanced_ground_instructor = '';
            }
            if (flight.instrument_ground_instructor === true){
                flight.instrument_ground_instructor = 'BGI';
            }
            if (flight.instrument_ground_instructor == null){
                flight.instrument_ground_instructor = '';
            }
            if (flight.helicopter_instructor === true){
                flight.helicopter_instructor = 'HI';
            }
            if (flight.helicopter_instructor == null){
                flight.helicopter_instructor = '';
            }
            if (flight.sport_pilot_instructor === true){
                flight.sport_pilot_instructor = 'SPI';
            }
            if (flight.sport_pilot_instructor == null){
                flight.sport_pilot_instructor = '';
            }
            if (flight.instructor_first == null) {
                flight.instructor_first = 'Solo';
            }
            if (flight.instructor_last == null) {
                flight.instructor_last = '';
            }
            res.json (flight);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});


// GET all squawks for an aircraft | GET | /flight/squawks/:aircraftid
router.get('/flight/squawks/:aircraftid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var aircraftId = req.params.aircraftid;
    db.any("SELECT s.squawk_id, " +
        "s.entry_date, " +
        "s.repair_date, " +
        "s.report, " +
        "s.reporter_reference_id, " +
        "p.first_name, " +
        "p.last_name " +
        "FROM squawk s " +
        "JOIN person p " +
        "ON (p.person_id = s.reporter_reference_id) " +
        "JOIN aircraft a " +
        "ON (s.aircraft_id = a.aircraft_id) " +
        "WHERE a.aircraft_id = $1", [aircraftId])
        .then(squawk => {
        res.json(squawk);
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
});



router.put('/flight/close/:flightid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var flightId = req.params.flightid;
    db.task(t => {
        return t.one("UPDATE aircraft a " +
            "SET aircraft_status = $1 " +
            "FROM flight f " +
            "WHERE a.aircraft_id = f.aircraft_id " +
            "AND f.flight_id = $2 " +
            "RETURNING flight_id", ['flight_line', flightId])
            .then(flight => {
                //console.log(flight);
                return t.none("UPDATE flight " +
                    "SET " +
                    "flight_status = $1 " +
                    "WHERE flight_id = $2", ['closed', flightId])
            })
    })
        .then(function (flight) {
            res.json(flight);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});


//Add a new checkout
router.post('/checkout/newcheckout/:membershipid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var membershipId = req.params.membershipid;
    db.task(t => {
        return t.one(
            'INSERT INTO checkout ' +
            '(aircraft_id, ' +
            'currency_end_date, ' +
            'ifr_checkout, ' +
            'membership_id) ' +
            'VALUES ' +
            '($1, ' +
            '$2, ' +
            '$3, ' +
            '$4) ' +
            'RETURNING aircraft_id', [req.body.aircraft_id, req.body.currency_end_date, req.body.ifr_checkout, membershipId]
        )
            .then(aircraft => {
                return t.one(
                    'SELECT * ' +
                    'FROM aircraft a ' +
                    'LEFT JOIN aircraft_model am ' +
                    'ON (a.aircraft_model_id = am.aircraft_model_id) ' +
                    'WHERE a.aircraft_id = $1 ', aircraft.aircraft_id
                )
                    .then(checkout => {
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
                            'AND a.aircraft_id != $7', [checkout.school_id, checkout.faa_type_designation, checkout.glass_cockpit, checkout.complex, checkout.tailwheel, checkout.engine, checkout.aircraft_id]
                        )

                    })
            })
    })

        .then(function (checkouts) {
            for (i = 0; i < checkouts.length; i++) {
                db.none(
                    'INSERT INTO checkout ' +
                    '(aircraft_id, ' +
                    'currency_end_date, ' +
                    'ifr_checkout, ' +
                    'membership_id) ' +
                    'VALUES ' +
                    '($1, ' +
                    '$2, ' +
                    '$3, ' +
                    '$4)', [checkouts[i].aircraft_id, req.body.currency_end_date, req.body.ifr_checkout, membershipId]
                )
            }
        })
            .catch(function (error) {
                console.log("ERROR:", error);

        })
        .then(function (newcheckouts) {
            console.log (newcheckouts)
            res.status(200).end();
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
})

router.put('/checkout/:membershipid/:aircraftid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var membershipId = req.params.membershipid;
    var aircraftId = req.params.aircraftid;
    db.task(t => {
        return t.one(
            'UPDATE checkout ' +
            'SET ' +
            'currency_end_date = $1, ' +
            'ifr_checkout = $2 ' +
            'WHERE membership_id = $3 ' +
            'AND aircraft_id = $4' +
            'RETURNING checkout_id', [req.body.currency_end_date, req.body.ifr_checkout, membershipId, aircraftId]
        )
            .then(aircraft => {
                return t.one(
                    'SELECT * ' +
                    'FROM aircraft a ' +
                    'LEFT JOIN aircraft_model am ' +
                    'ON (a.aircraft_model_id = am.aircraft_model_id) ' +
                    'WHERE a.aircraft_id = $1 ', aircraftId
                )
                    .then(checkout => {
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
                            'AND a.aircraft_id != $7', [checkout.school_id, checkout.faa_type_designation, checkout.glass_cockpit, checkout.complex, checkout.tailwheel, checkout.engine, checkout.aircraft_id]
                        )

                    })
            })

    })
        .then(function (checkouts) {
            for (i = 0; i < checkouts.length; i++) {
                db.none(
                    'UPDATE checkout ' +
                    'SET ' +
                    'currency_end_date = $1, ' +
                    'ifr_checkout = $2 ' +
                    'WHERE membership_id = $3 ' +
                    'AND aircraft_id = $4', [req.body.currency_end_date, req.body.ifr_checkout, membershipId, checkouts[i].aircraft_id]
                )
            }
        })
            .catch(function (error) {
                console.log("ERROR:", error);

        })

        .then(function (updatecheckouts) {
            console.log (updatecheckouts)
            res.json(updatecheckouts)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});

router.put('/flightreview/:personid', function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.one(
        'UPDATE person ' +
        'SET ' +
        'flight_review_date = $1 ' +
        'WHERE person_id = $2 ' +
        'RETURNING flight_review_date', [req.body.flight_review_date, personId]
    )
            .then(function (flightReview) {
                console.log(flightReview);
                res.status(200).end();
            })
            .catch(function (error) {
                console.log("ERROR:", error);
            });

});

//route to get all flights for a person
router.get('/flight/all/:personid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    db.any("SELECT f.flight_id, " +
        "f.flight_type " +
        "FROM flight f " +
        "JOIN person p " +
        "ON (f.customer_id = p.person_id) " +
        "WHERE p.person_id = $1 " +
        "UNION " +
        "SELECT f.flight_id, " +
        "f.flight_type " +
        "FROM flight f " +
        "JOIN person p " +
        "ON (f.instructor_id = p.person_id) " +
        "WHERE p.person_id = $1 ", [personId])
        .then(flights => {
            res.json(flights);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });

});

router.get('/flight/completed/:schoolid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    db.any("SELECT f.flight_id, "+
        "f.flight_creation_time, " +
        "f.dispatch_time, " +
        "f.dispatched_by, " +
        "f.release_sms_id, " +
        "f.complete_sms_id, " +
        "f.flight_status, " +
        "f.flight_type, " +
        "customer.person_id AS customer_id, " +
        "customer.first_name AS customer_first, " +
        "customer.last_name AS customer_last, " +
        "customer.mobile, " +
        "customer.email, " +
        "instructor.person_id AS instructor_id, " +
        "instructor.first_name AS instructor_first, " +
        "instructor.last_name AS instructor_last, " +
        "a.aircraft_id, " +
        "a.registration_nbr, " +
        "a.aircraft_status, " +
        "am.aircraft_model_id, " +
        "am.make, " +
        "am.model_id, " +
        "am.popular_name " +
        "FROM flight f " +
        "JOIN aircraft a " +
        "ON (f.aircraft_id = a.aircraft_id) " +
        "JOIN aircraft_model am " +
        "ON (a.aircraft_model_id = am.aircraft_model_id) " +
        "JOIN person customer " +
        "ON (f.customer_id = customer.person_id) " +
        "LEFT JOIN person instructor " +
        "ON (f.instructor_id = instructor.person_id) " +
        "WHERE 1 = 1 " +
        "AND f.school_id = $1 " +
        "AND f.flight_status = $2 " +
        "ORDER BY f.flight_creation_time", [schoolId, 'completed'])
        .then(function (flight){
            for (var i = 0; i < flight.length; i++) {
                if (flight[i].instructor_first == null) {
                    flight[i].instructor_first = '';
                }
                if (flight[i].instructor_last == null) {
                    flight[i].instructor_last = '';
                }
            }
            res.json(flight);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});

// GET all squawks for an aircraft | GET | /flight/:aircraftid/squawks
router.get('/flight/squawks/:aircraftid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var aircraftId = req.params.aircraftid;
    db.any("SELECT s.squawk_id, " +
        "s.entry_date, " +
        "s.repair_date, " +
        "s.report, " +
        "s.reporter_reference_id, " +
        "p.first_name, " +
        "p.last_name " +
        "FROM squawk s " +
        "JOIN person p " +
        "ON (p.person_id = s.reporter_reference_id) " +
        "JOIN aircraft a " +
        "ON (s.aircraft_id = a.aircraft_id) " +
        "WHERE a.aircraft_id = $1", [aircraftId])
        .then(squawk => {
            res.json(squawk);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});

// POST a new squawk for an aircraft | POST | /flight/:aircraftid/squawks
router.post('/flight/squawk/new/:aircraftid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var aircraftId = req.params.aircraftid;
    db.one(
        'INSERT INTO squawk ' +
        '(entry_date, ' +
        'repair_date, ' +
        'report, ' +
        'reporter_reference_id, ' +
        'aircraft_id) ' +
        'VALUES ' +
        '($1, ' +
        '$2, ' +
        '$3, ' +
        '$4, ' +
        '$5) ' +
        'RETURNING squawk_id', [dateFormat(now, "isoDateTime"), req.body.repair_date, req.body.report, req.body.reporter_reference_id, aircraftId]
    )
        .then(function (squawk) {
            console.log (squawk)
            res.status(200).end();
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});

module.exports = router;