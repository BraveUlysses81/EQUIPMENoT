var app = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var authenticate = (req, res, next) => {
    var authorizationHeader = req.headers['authorization'];
    var token;

    if(authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if(token) {
        jwt.verify(token, config.jwt.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Failed to authenticate' })
            } else {
                const login_id = decoded.login_id
                const db = req.app.get('conn');

                db.one("SELECT l.login_id, " +
                "l.username, " +
                "l.email, " +
                "l.requested_school FROM login l " +
                "WHERE l.login_id = $1", login_id)
                .then((login) => {
                    req.currentUser = login;
                    next();
                })
                .catch (() => {
                    res.status(404).json({ error: 'User not found'})
                })
            }
        })
    } else {
        res.status(403).json({
            error: 'No token provided'
        })
    }
};

module.exports = authenticate;