// var pg = require('pg');
// var promise = require('bluebird');
var pgoptions = {
    query: function (e) {
        console.log('Query: ' + e.query);
        if (e.ctx) {
            console.log('this query is executing inside a transaction,' +
                'and ctx contains all the relevant details.', e.ctx);
        }
    },
    error: function (err, e) {
        console.log('Error: ' + err);
        if (e.cn) {
            // this is a connection-related error;
            // cn = connection details that were used.
        }
        if (e.query) {
            console.log('Query:', e.query);
            if (e.params) {
                console.log('Parameters:', e.params);
            }
        }
        if (e.ctx) {
            // print transaction details;
        }
    }
    // promiseLib: promise
};

module.exports = pgoptions;