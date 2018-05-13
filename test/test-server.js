var chai = require('chai');
var chaiHttp = require('chai-http');
var express = require('express');
var path = require('path');

var server = require(path.join(__dirname, '..', 'server.js'));
var should = chai.should();

chai.use(chaiHttp);

var token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbl9pZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsInBlcnNvbl9pZCI6MSwicGljdHVyZV91cmwiOiJodHRwOi8vZmxpZ2h0Y29tcHV0ZXIubmV0L3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDEzLzA2L0hhcnJpc29uLUZvcmQtSGVsaWNvcHRlci1yZXNjdWUtMS5qcGVnIiwiaWF0IjoxNDk2MzQ1NzUwfQ.-tEOiUrOyVRYyjAqdzWquey4lG_zYSbQcU7_qnzHYlc';

// AIRCRAFT TESTS

// Should List ALL Aircraft for a Single School
describe('schools/:schoolId/aircraft', function() {
   it('should list ALL aircraft for a SINGLE school', function(done) {
       chai.request(server)
           .get('/schools/1/aircraft')
           .set('Authorization', token)
           .end(function (err, res) {
               res.should.have.status(200);
               res.should.be.json;
               res.body.should.be.a('array');
               res.body[0].should.have.property('school_id');
               res.body[0].school_id.should.equal(1);
               done();
           });
   });
});

// CUSTOMER TESTS
describe('schools/:schoolid', function(){
    it('should return ONE school based upon the given Id', function(done){
        chai.request(server)
            .get('/schools/1')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('school_id', 1);
                res.body.should.have.property('school_name')
                    .that.is.a('string');
                res.body.should.have.property('school_name', 'Look Ma, No Wings!');
                done();
            });
    })
});

// describe('schools/', function(){
//     it('should return the school object and all of it\'s fields', function(done){
//         chai.request(server)
//             .post('/schools')
//             .send({'school_name': 'Namey McNamerson',
//                 'address' : '123 fake st',
//                 'city' : 'jonesville',
//                 'state' : 'AK',
//                 'country' : 'USA',
//                 'zip' : '5446799',
//                 'phone' : '2346',
//                 'mobile': null,
//                 'email' : 'john@lollygagger.com',
//                 'airnc' : null,
//                 'fax' : null})
//             .end(function(err, res){
//                 res.should.have.status(200);
//                 res.should.be.json;
//                 res.body.should.be.a('array');
//                 res.body[0].should.have.property('contact_id')
//                     .that.is.a('number');
//                 res.body[0].should.have.property('address')
//                     .that.is.a('string');
//                 done();
//             })
//     });
// });



module.exports = server;