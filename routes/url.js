var app = require('express');
var router = app.Router();
var path = require('path');
var jwt = require('jsonwebtoken');
var authenticate = require('../middleware/authenticate');
var isEmpty = require('lodash/isEmpty');
var validator = require('validator');


var config = require('../config/config');

router.post('/person/photo/:personid', authenticate, function (req, res){
    var db = req.app.get('conn');
    var person_id = req.params.personid;

    var contentType = req.body.contentType;
    var image = req.body.image;
    var key = jwt.sign(`person-${person_id}`,config.jwt.jwtSecret);

    var buf = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""),'base64')

    var params = {
        Bucket: 'equipmenot',
        Key: key,
        ACL: 'authenticated-read',
        ContentEncoding: 'base64',

        ContentType: contentType,
        Body: buf
    };

    db.tx(function (t) {
        var q1 = this.none('UPDATE person ' +
            'SET picture_url = $1 ' +
            'WHERE person_id = $2', [key, person_id] )

        var q2 = config.s3.upload(params, function(err, data){
            if(err) {
                console.log("this is the resultant shit: ", err);
                res.status(400).json(err)
            }
            if(data){
                console.log(data);
                res.status(200).json('success')
            }
        });
        return t.batch([q1, q2]);
    }).catch((err) => {
        console.log(err)
    })
});

module.exports = router;