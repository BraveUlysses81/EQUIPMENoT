var app = require('express');
var snap = app();
var router = app.Router();
var http = require('http');
var express = require('express');
var twilio = require('twilio');
var client = twilio('AC2f7541578b8701c7c0ef07046825f867', '48a80b5dc1806c8d9d9b18c3afd54bbb');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

snap.use(bodyParser.urlencoded({ extended: true }));
snap.use(cookieParser());



router.get('/sns', function(req, res) {
    var db = req.app.get('conn');
    var cook = req["cookies"]["connect.sid"];
    var mobile = (req.query.From.split("+1"))[1];

    db.task(t => {
        console.log("checking the mobile number")
        return t.one("SELECT f.flight_id, " +
            "f.flight_status " +
            "FROM flight f " +
            "JOIN person p " +
            "ON (f.customer_id = p.person_id) " +
            "WHERE p.mobile = $1 " +
            "AND (f.flight_status = $2 " +
            "OR f.flight_status = $3)", [mobile, 'dispatched', 'in_flight'])
    }).then(flight => {
        console.log("Did we get here?");
        if (flight.flight_status == 'dispatched'){
            console.log("Is the flight_status dispatched?")
            var twiml = new twilio.twiml.MessagingResponse();
            if (req.query.Body == 'Y' || req.query.Body == 'y' || req.query.Body == 'yes' || req.query.Body == 'Yes') {
                db.task(t => {
                    console.log("touching the yes's")
                    return t.one("UPDATE flight f " +
                        "SET flight_status = $1, " +
                        "sms_release_id = $2 " +
                        "FROM person p " +
                        "WHERE (f.customer_id = p.person_id) " +
                        "AND p.mobile = $3 " +
                        "AND f.flight_status = $4 " +
                        "RETURNING flight_id", ['in_flight', cook, mobile, 'dispatched'])
                        .then(flight => {
                            console.log(flight);
                            req["cookies"]['flight'] = flight.flight_id;
                            console.log(req.query);
                            console.log(req.cookies);
                            console.log("Do we get above the message");
                        })
                })
                twiml.message('Thanks, your flight has been released. On return please send updated hobbs and tach as H:# T:#');
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml.toString());
            } else if(req.query.Body == 'N' || req.query.Body == 'n' || req.query.Body == 'No' || req.query.Body == 'no') {
                console.log("touching the no's");
                //console.log(req.cookies);
                twiml.message('Please come into the office to resolve the discrepancy');
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml.toString());
            } else {
                console.log("touching the anything else");
                //console.log(req["cookies"]["connect.sid"]);
                twiml.message('Please confirm the hobbs and tach (Y or N)');
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml.toString());
            }
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
        }
        else if (flight.flight_status == 'in_flight'){
            console.log("Is the flight_status in_flight?")
            var twiml2 = new twilio.twiml.MessagingResponse();
            var re = /^(?:(?!H:)[0-9 ])*H:(?!.*H:).*(?:(?!T:).)*T:(?!.*<T:)[0-9 ]*$/m;

            if (re.test(req.query.Body)) {
                var chunk = (req.query.Body).split("H:")[1];
                var hobbs = parseFloat(chunk.split("T:")[0].trim());
                var tach = parseFloat(chunk.split("T:")[1].trim());
                if (!isNaN(hobbs) && !isNaN(tach)) {
                db.task(t => {
                    console.log("we're inside a proper return response")
                    return t.one("UPDATE flight f " +
                        "SET flight_status = $1, " +
                        "sms_complete_id = $2, " +
                        "end_tach = $3 " +
                        "FROM person p " +
                        "WHERE (f.customer_id = p.person_id) " +
                        "AND p.mobile = $4 " +
                        "AND f.flight_status = $5 " +
                        "RETURNING flight_id", ['completed', cook, tach, mobile, 'in_flight'])
                        .then(flight => {
                            console.log(flight);
                            req["cookies"]['flight'] = flight.flight_id;
                            console.log(req.query);
                            console.log(req.cookies);
                            console.log("Did this work?");
                            return t.none("UPDATE aircraft a " +
                                "SET aircraft_status = $1, " +
                                "hobbs = $2, " +
                                "tach = $3 " +
                                "FROM flight f " +
                                "WHERE (a.aircraft_id = f.aircraft_id) " +
                                "AND f.flight_id = $4", ['flight_line', hobbs, tach, flight.flight_id]
                            )
                        })
                        .then(function (flight) {
                            res.json(flight);
                        })
                        .catch(function (error) {
                            console.log("ERROR:", error.message || error);
                        });
                })
                twiml2.message('Thanks. Your Hobbs: ' + hobbs + ' & Tach: ' + tach + '. If this is incorrect, ' +
                    'please stop by the office to correct.');
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml2.toString());
                }
                else{
                    console.log("try again inner");
                    twiml2.message('Please send updated hobbs and tach as H:# T:#');
                    res.writeHead(200, {'Content-Type': 'text/xml'});
                    res.end(twiml2.toString());
                }
            }
            else {
                console.log("try again");
                twiml2.message('Please send updated hobbs and tach as H:# T:#');
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml2.toString());
            }
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml2.toString());

        }
    })


});

// router.get('/sns', function(req, res) {
//     var twiml = new twilio.twiml.MessagingResponse();
//     var db = req.app.get('conn');
//     var cook = req["cookies"]["connect.sid"];
//     var mobile = (req.query.From.split("+1"))[1];
//     //console.log(mobile);
//     //console.log(twiml);
//     if (req.query.Body == 'Y' || req.query.Body == 'y' || req.query.Body == 'yes' || req.query.Body == 'Yes') {
//         db.task(t => {
//             console.log("touching the yes's")
//             return t.one("UPDATE flight f " +
//                 "SET flight_status = $1, " +
//                 "sms_id = $2 " +
//                 "FROM person p " +
//                 "WHERE (f.customer_id = p.person_id) " +
//                 "AND p.mobile = $3 " +
//                 "AND f.flight_status = $4 " +
//                 "RETURNING flight_id", ['in_flight', cook, mobile, 'dispatched'])
//                 .then(flight => {
//                     console.log(flight);
//                     req["cookies"]['flight'] = flight.flight_id;
//                     console.log(req.query);
//                     console.log(req.cookies);
//                     console.log("Do we get above the message");
//                     twiml.message(`Thanks, your flight has been released. On return please send updated hobbs and tach`);
//                 })
//         })
//         twiml.message('Thanks, your flight has been released.');
//         res.writeHead(200, {'Content-Type': 'text/xml'});
//         res.end(twiml.toString());
//     } else if(req.query.Body == 'N' || req.query.Body == 'n' || req.query.Body == 'No' || req.query.Body == 'no') {
//         console.log("touching the no's");
//         //console.log(req.cookies);
//         twiml.message('Please come into the office to resolve the discrepancy');
//         res.writeHead(200, {'Content-Type': 'text/xml'});
//         res.end(twiml.toString());
//     } else {
//         console.log("touching the anything else");
//         //console.log(req["cookies"]["connect.sid"]);
//         twiml.message('Please confirm the hobbs and tach (Y or N)');
//         res.writeHead(200, {'Content-Type': 'text/xml'});
//         res.end(twiml.toString());
//     }
//     res.writeHead(200, {'Content-Type': 'text/xml'});
//     res.end(twiml.toString());
// });


module.exports = router;