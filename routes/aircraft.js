
var app = require('express');
var router = app.Router();
var _ = require('lodash');
var authenticate = require('../middleware/authenticate');

// GET aircraft by schoolid and aircraftid | GET | /aircraft/:schoolid/:aircraftid
router.get('/aircraft/:schoolid/:aircraftid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var aircraftId = req.params.aircraftid;
    db.one("SELECT " +
        "a.*, " +
        "am.* " +
        "FROM aircraft a " +
        "JOIN aircraft_model am " +
        "ON (a.aircraft_model_id = am.aircraft_model_id) " +
        "WHERE a.school_id = $1 " +
        "AND a.aircraft_id = $2", [schoolId, aircraftId])
        .then(function (aircraft) {
            res.json(aircraft);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});




// GET aircraft by schoolid | GET | /schools/aircraft/:schoolid

router.get('/schools/aircraft/:schoolid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    db.any("SELECT " +
        "a.*, " +
        "am.* " +
        "FROM aircraft a " +
        "JOIN aircraft_model am " +
        "ON (a.aircraft_model_id = am.aircraft_model_id) " +
        "WHERE a.school_id = $1", schoolId)
        .then(function (aircraft) {
            res.json(aircraft);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});

// GET aircraft details by schoolid | GET | /school/aircrafts/:schoolid
router.get('/school/aircrafts/:schoolid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    db.any('SELECT ' +
        'a.aircraft_id, a.airbags, a.aircraft_model_id, a.aircraft_status, a.auto_pilot, a.currency_days, a.dual_only, a.elt_certification, ' +
        'a.glass_cockpit, a.gps, a.gps_database_update, a.hobbs, a.hundred_hr_inspection, a.ifr_certificate, a.night_certificate, ' +
        'a.parachute, a.picture_url, a.pitot_static_inspection, a.registration_nbr, a.school_id, a.tach, a.transponder_certification, a.vor_check, a.year, ' +
        'am.aircraft_model_id, am.aerobatic, am.biplane, am.category, am.class, am.classic, am.complex, am.engine, am.faa_type_designation, am.make, ' +
        'am.model_id, am.popular_name, am.tailwheel, am.turbo, am.warbird, ' +
        'sq.squawk_id, sq.aircraft_id, sq.entry_date, sq.repair_date, sq.report, sq.reporter_reference_id ' +
        'FROM aircraft a ' +
        'JOIN aircraft_model am ' +
        'ON (a.aircraft_model_id = am.aircraft_model_id) ' +
        'LEFT JOIN squawk sq ' +
        'ON (a.aircraft_id = sq.aircraft_id) ' +
        'WHERE a.school_id = $1', schoolId)
        .then(function (aircrafts) {
            res.json(aircrafts);
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});

// Edit an aircraft | POST | /api/aircraft/:aircraftid
router.put('/aircraft/:aircraftid', authenticate, (req, res) => {
    const db = req.app.get('conn');
    const aircraftId = req.params.aircraftid;

    const { tach, hobbs, hundred_hr_inspection, pitot_static_inspection, vor_check, dual_only, ifr_certificate,
            night_certificate, transponder_certification, elt_certification, gps_database_update, glass_cockpit,
            auto_pilot, airbags, parachute, gps } = req.body.aircraft;

    db.none("UPDATE aircraft " +
        "SET " +
        "tach = $1, hobbs = $2, hundred_hr_inspection = $3, pitot_static_inspection = $4, " +
        "vor_check = $5, dual_only = $6, ifr_certificate = $7, night_certificate = $8, " +
        "transponder_certification = $9, elt_certification = $10, gps_database_update = $11, " +
        "glass_cockpit = $12, auto_pilot = $13, airbags = $14, parachute = $15, gps = $16 " +
        "WHERE aircraft_id = $17", [tach, hobbs, hundred_hr_inspection, pitot_static_inspection, vor_check,
        dual_only, ifr_certificate, night_certificate, transponder_certification, elt_certification,
        gps_database_update, glass_cockpit, auto_pilot, airbags, parachute, gps, aircraftId])
        .then( () => {
            res.status(200).json('success');
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

// Edit a non active aircraft's status
router.put('/aircraft/status/:registration_nbr', authenticate, (req, res) => {
    const db = req.app.get('conn');
    const registration_nbr = req.params.registration_nbr;
    const { aircraft_status } = req.body;
    const { flightsToCancel } = req.body;

    if(aircraft_status !== 'active') {
        db.task((t) => {
            return t.none("UPDATE aircraft " +
                "SET aircraft_status = $1 " +
                "WHERE registration_nbr = $2", [aircraft_status, registration_nbr])
                .then(() => {
                    //map through flightsToCancel object to set status on each flight
                    var queries = Object.keys(flightsToCancel).map(key => {
                        return t.none("UPDATE flight " +
                            "SET flight_status = $1 " +
                            "WHERE flight_id =$2", ['cancelled', flightsToCancel[key]]
                        )
                    });
                    return t.batch(queries);
                })
        })
        .then(() => {
                res.status(200).json('success');
            })
        .catch((err) => {
            res.status(400).json({ form: err });
        })

    } else {
        res.status(400).json({ form: "Unable to update aircraft in Active Status"});
    }
});

// Add a new Aircraft | POST | /api/school/:schoolid
router.post('/aircraft/add/:schoolid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    const { registration_nbr, make, model_id, dual_only, year, hobbs, tach, ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection,
        transponder_certification, elt_certification, vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags,
        parachute, currency_days, picture_url, engine, nullEngine, nullModelEngine } = req.body.aircraft

    //nullModelEngine && nullEngine both false
    if(!nullEngine && !nullModelEngine ){
        db.task((t) => {
            return t.one(
                "SELECT am.model_id " +
                "FROM aircraft_model am " +
                "WHERE am.make = $1 AND am.model_id = $2 AND am.engine = $3", [make, model_id, engine]
            )
                .then((plane) =>{
                    db.none("INSERT " +
                        "INTO aircraft " +
                        "(registration_nbr, school_id, dual_only, year, " +
                        "hobbs, tach, ifr_certificate, night_certificate, " +
                        "hundred_hr_inspection, pitot_static_inspection, transponder_certification, " +
                        "elt_certification, vor_check, gps_database_update, glass_cockpit, gps, " +
                        "auto_pilot, airbags, parachute, currency_days, picture_url, aircraft_model_id) " +
                        "SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, " +
                        "$15, $16, $17, $18, $19, $20, $21, aircraft_model.aircraft_model_id " +
                        "FROM aircraft_model " +
                        "WHERE aircraft_model.make = $22 " +
                        "AND aircraft_model.model_id = $23 " +
                        "AND aircraft_model.engine = $24", [registration_nbr, schoolId, dual_only, year, hobbs, tach,
                        ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification,
                        vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, currency_days, picture_url, make, plane.model_id, engine])
                        .then(function (aircraft) {
                            res.json(aircraft);
                        })
                        .catch(function (err) {
                            res.status(400).json({ form: err.response });
                        });
                })
                .catch((err) => {
                    res.status(400).json({ form: err.response });
                })
        });
    } else if (nullEngine) {
        db.task((t) => {
            return t.one(
                "SELECT am.model_id " +
                "FROM aircraft_model am " +
                "WHERE am.make = $1 AND am.model_id = $2", [make, model_id]
            )
                .then((plane) =>{
                    db.none("INSERT " +
                        "INTO aircraft " +
                        "(registration_nbr, school_id, dual_only, year, " +
                        "hobbs, tach, ifr_certificate, night_certificate, " +
                        "hundred_hr_inspection, pitot_static_inspection, transponder_certification, " +
                        "elt_certification, vor_check, gps_database_update, glass_cockpit, gps, " +
                        "auto_pilot, airbags, parachute, currency_days, picture_url, aircraft_model_id) " +
                        "SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, " +
                        "$15, $16, $17, $18, $19, $20, $21, aircraft_model.aircraft_model_id " +
                        "FROM aircraft_model " +
                        "WHERE aircraft_model.make = $22 " +
                        "AND aircraft_model.model_id = $23", [registration_nbr, schoolId, dual_only, year, hobbs, tach,
                        ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification,
                        vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, currency_days, picture_url, make, plane.model_id])
                        .then(function (aircraft) {
                            res.json(aircraft);
                        })
                        .catch(function (err) {
                            res.status(400).json({ form: err.response });
                        });
                })
                .catch((err) => {
                    res.status(400).json({ form: err.response });
                })
        });
    } else if (nullModelEngine) {
        db.task((t) => {
            return t.one(
                "SELECT am.model_id " +
                "FROM aircraft_model am " +
                "WHERE am.make = $1", [make]
            )
                .then((plane) =>{
                    db.none("INSERT " +
                        "INTO aircraft " +
                        "(registration_nbr, school_id, dual_only, year, " +
                        "hobbs, tach, ifr_certificate, night_certificate, " +
                        "hundred_hr_inspection, pitot_static_inspection, transponder_certification, " +
                        "elt_certification, vor_check, gps_database_update, glass_cockpit, gps, " +
                        "auto_pilot, airbags, parachute, currency_days, picture_url, aircraft_model_id) " +
                        "SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, " +
                        "$15, $16, $17, $18, $19, $20, $21, aircraft_model.aircraft_model_id " +
                        "FROM aircraft_model " +
                        "WHERE aircraft_model.make = $22", [registration_nbr, schoolId, dual_only, year, hobbs, tach,
                        ifr_certificate, night_certificate, hundred_hr_inspection, pitot_static_inspection, transponder_certification, elt_certification,
                        vor_check, gps_database_update, glass_cockpit, gps, auto_pilot, airbags, parachute, currency_days, picture_url, make, engine])
                        .then(function (aircraft) {
                            res.json(aircraft);
                        })
                        .catch(function (err) {
                            res.status(400).json({ form: err.response });
                        });
                })
                .catch((err) => {
                    res.status(400).json({ form: err.response });
                })
        });
    } else {
        res.status(400).json({ form: err.response });
    }
});

//get all aircraft by school
router.get('/schools/:schoolid/:aircraftid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    var aircraftId = req.params.aircraftid;
    db.one("SELECT " +
        "sq.*," +
        "a.*, " +
        "am.*," +
        "f.*," +
        "ao.* " +
        "FROM aircraft a " +
        "JOIN aircraft_model am " +
        "ON (a.aircraft_model_id = am.aircraft_model_id) " +
        "LEFT JOIN aircraft_ownership ao " +
        "ON (ao.aircraft_id = a.aircraft_id) " +
        "LEFT JOIN squawk sq " +
        "ON (a.aircraft_id = sq.aircraft_id) " +
        "LEFT JOIN flight f " +
        "ON (a.aircraft_id = f.aircraft_id " +
        "AND f.flight_creation_time = (SELECT MAX(flight_creation_time) " +
        "FROM flight " +
        "WHERE aircraft_id = a.aircraft_id)) " +
        "LEFT JOIN leg l " +
        "ON (f.flight_id = l.flight_id) " +
        "WHERE a.school_id = $1 " +
        "AND a.aircraft_id = $2", [schoolId, aircraftId])
        .then(function (aircraft) {
            res.json(aircraft);
        })
        .catch(function (err) {
            res.status(400).json({ form: err.response });
        });
});

//get all aircraft makes
router.get('/aircraft/makes', authenticate, function (req, res) {
    var db = req.app.get('conn');

    db.any('SELECT DISTINCT ' +
        'am.make FROM aircraft_model am ORDER BY am.make')
        .then(function (makes) {
            res.json(makes);
        })
        .catch(function (err) {
            res.status(400).json({ form: err.response });
        });
});

//get all aircraft models by given make
router.get('/aircraft/aircraft_model/model_ids/:make', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var make = req.params.make;

    db.any('SELECT DISTINCT ' +
        'am.model_id FROM aircraft_model am ' +
        'WHERE am.make = $1 ' +
        'ORDER BY am.model_id', make)
        .then(function (aircrafts) {
            if (aircrafts[0].model_id === null){
                aircrafts = null;
            }
            res.json(aircrafts);
        })
        .catch(function (err) {
            res.status(400).json({ form: err.response });
        });
});

//get all engines by make and model
router.get('/aircraft/aircraft_model/engine/:model', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var model_id = req.params.model;

    db.any('SELECT DISTINCT ' +
            'am.engine FROM aircraft_model am ' +
            'WHERE am.model_id = $1 ' +
            'ORDER BY am.engine', model_id)
        .then( (engines) => {
            if (engines[0].engine === null) {
                engines = null;
            }
            res.json(engines);
        })
        .catch( (err) => {
            res.status(400).json({ form: err.response });
        })
});

//get all engines by make and model
router.get('/aircraft/flight/:personid/:aircraftid', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var personId = req.params.personid;
    var aircraftId = req.params.aircraftid;

    db.any('SELECT f.flight_id ' +
        'FROM flight f ' +
        'JOIN person p ' +
        'ON (f.customer_id = p.person_id) ' +
        'JOIN aircraft a ' +
        'ON (f.aircraft_id = a.aircraft_id) ' +
        'WHERE a.aircraft_id = $1 ' +
        'AND p.person_id = $2 ' +
        'UNION ' +
        'SELECT f.flight_id ' +
        'FROM flight f ' +
        'JOIN person p ' +
        'ON (f.instructor_id = p.person_id) ' +
        'JOIN aircraft a ' +
        'ON (f.aircraft_id = a.aircraft_id) ' +
        'WHERE a.aircraft_id = $1 ' +
        'AND p.person_id = $2 ', [aircraftId, personId])
        .then( (flights) => {
            res.json(flights);
        })
        .catch( (err) => {
            res.status(400).json({ form: err.response });
        })
});

module.exports = router;