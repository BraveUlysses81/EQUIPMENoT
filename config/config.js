
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var s3 = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: 'AKIAICTCUEGDQIATZLSQ',
    secretAccessKey: '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'
});

var jwt = {
    jwtSecret: 'balderdash2017mayapril2'
}

module.exports = {
    jwt,
    s3
};