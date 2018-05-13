var app = require('express');
var router = app.Router();
var _ = require('lodash');
var authenticate = require('../middleware/authenticate');


router.get('/search/:school_id/:searchstring', authenticate, function (req, res) {
    var db = req.app.get('conn');
    var schoolId = req.params.school_id;
    var searchString = '%' + req.params.searchstring + '%';
    db.any("SELECT pkid, first_name, last_name, type " +
        "FROM (SELECT row_number() OVER (ORDER BY flight_creation_time DESC) AS rownum, " +
            "p.person_id AS pkid, " +
            "p.first_name, " +
            "p.last_name, " +
            "flight_creation_time, " +
            "'customers' AS type " +
        "FROM person p " +
        "JOIN membership m " +
        "ON (m.person_id = p.person_id) " +
        "JOIN school s " +
        "ON (m.school_id = s.school_id) " +
        "LEFT JOIN flight f " +
        "ON (p.person_id = f.customer_id) " +
        "WHERE (lower(p.first_name) LIKE lower($1) " +
        "OR lower(p.last_name) LIKE lower($1)) " +
        "AND s.school_id = $2 " +
        "AND (m.dispatch_view_rights = $3 " +
        "AND m.admin_view_rights = $3) " +
        "UNION SELECT row_number() OVER (ORDER BY flight_creation_time DESC) AS rownum, " +
            "p.person_id AS pkid, " +
            "p.first_name, " +
            "p.last_name, " +
            "flight_creation_time, " +
            "'instructors' " +
        "FROM person p " +
        "JOIN membership m " +
        "ON (m.person_id = p.person_id) " +
        "JOIN school s " +
        "ON (m.school_id = s.school_id) " +
        "LEFT JOIN flight f " +
        "ON (p.person_id = f.instructor_id) " +
        "WHERE (LOWER(p.first_name) LIKE lower($1) " +
        "OR lower(p.last_name) LIKE lower($1)) " +
        "AND s.school_id = $2 " +
        "AND (m.dispatch_view_rights = $4 " +
        "OR m.admin_view_rights = $4) " +
        "UNION SELECT row_number() OVER (ORDER BY flight_creation_time desc) AS rownum, " +
            "a.aircraft_id AS pkid, " +
            "a.registration_nbr, " +
            "'', " +
            "f.flight_creation_time, " +
            "'aircraft' " +
        "FROM aircraft a " +
        "LEFT JOIN flight f USING (aircraft_id) " +
        "WHERE (lower(a.registration_nbr) LIKE lower($1))" +
        "AND a.school_id = $2) AS query " +
        "WHERE ROWNUM <= 4 " +
        "ORDER BY type, rownum", [searchString, schoolId, false, true])
        .then(function (data) {
            console.log("here's the searchString" + searchString);
            console.log(data);
            function noDups(array) {
                var a = array.concat();
                for(var i = 0; i < a.length; ++i) {
                    for(var j = i+1; j < a.length; ++j) {
                        if((a[i].pkid) + (a[i].type) === (a[j].pkid) + (a[j].type))
                            a.splice(j--, 1);
                    }
                }
                return a;
            }
            var checked = noDups(data);
            res.json(checked);
        })
        .catch(function (error) {
            console.log("ERROR:", error);
        });
});

module.exports = router;