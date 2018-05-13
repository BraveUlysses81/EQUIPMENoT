var app = require('express');
var router = app.Router();
var _ = require('lodash');
var authenticate = require('../middleware/authenticate');

//Add a new school /api/schools
//
router.post('/schools', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var school = _.pick(req.body, 'school_name');
    var contact = _.pick(req.body, 'address', 'city', 'state', 'country', 'zip', 'phone', 'airnc', 'fax');
    db.tx(function (t) {
        // `t` and `this` here are the same;
        // creating a sequence of transaction queries:
        var q1 = this.one('INSERT INTO school (school_name) VALUES ($1) returning school_id, school_name', school.school_name);
        var q2 = this.one('INSERT ' +
            'INTO contact' +
                '(address, ' +
                'city, ' +
                'state, ' +
                'country, ' +
                'zip, ' +
                'phone, ' +
                'airnc, ' +
                'fax) ' +
            'VALUES ' +
                '($1, ' +
                '$2, ' +
                '$3, ' +
                '$4, ' +
                '$5, ' +
                '$6, ' +
                '$7, ' +
                '$8) ' +
            'RETURNING contact_id, address, city, state, country, zip, phone, airnc, fax',
            [ contact.address, contact.city, contact.state, contact.country, contact.zip, contact.phone, contact.airnc, contact.fax]);

        // returning a promise that determines a successful transaction:
        return t.batch([q1, q2]); // all of the queries are to be resolved;
    })
        .then(function (data) {
            console.log(data); // printing successful transaction output;
            var schoolId = data[0].school_id;
            var contactId = data[1].contact_id;
            db.any('UPDATE contact set school_id=$1 WHERE contact_id=$2 RETURNING contact_id, address, city, state, country, zip, phone, airnc, fax, school_id', [schoolId, contactId])
                .then(function (school) {
                    console.log(school);
                    res.json(school);
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error); // printing the error;
        });
});

//GET a single school  /api/schools/:schoolId
router.get('/schools/:schoolid', function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.schoolid;
    db.one('SELECT * FROM school WHERE school_id = $1', schoolId)
        .then(function (school) {
            res.json(school);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        })
});


//GET all schools
router.get('/schools', function (req, res) {
    console.log("just inside the GET all schools");
    var db = req.app.get('conn');
    db.any('SELECT * FROM school s ORDER BY s.school_id ')
        .then(function (schools) {
            res.json(schools)
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        })
})


module.exports = router;