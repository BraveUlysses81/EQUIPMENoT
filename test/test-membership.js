var chai = require('chai');
var chaiHttp = require('chai-http');
var express = require('express');
var path = require('path');

var server = require(path.join(__dirname, '..', 'server.js'));
var should = chai.should();

chai.use(chaiHttp);

var token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbl9pZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsInBlcnNvbl9pZCI6MSwicGljdHVyZV91cmwiOiJodHRwOi8vZmxpZ2h0Y29tcHV0ZXIubmV0L3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDEzLzA2L0hhcnJpc29uLUZvcmQtSGVsaWNvcHRlci1yZXNjdWUtMS5qcGVnIiwiaWF0IjoxNDk2MzQ1NzUwfQ.-tEOiUrOyVRYyjAqdzWquey4lG_zYSbQcU7_qnzHYlc';

describe('/membership/:personid/documents', function() {
    it('should list ALL documents for a SINGLE person', function(done) {
        chai.request(server)
            .get('/membership/1/documents')
            .set('Authorization', token)
            .end(function (err, res) {
                chai.expect(err).to.not.exist;
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('person_id');
                res.body[0].person_id.should.equal(1);
                res.body[0].document_id.should.not.be.null;
                done();
            });
    });
});

describe('/membership/:schoolid/:loginid/accept', function() {
    it('should add a membership record', function (done) {
        chai.request(server)
            .post('/membership/1/158/accept')
            .set('Authorization', token)
            .send({'membership_type': 'customer', 'agreement_signed': '06-01-2017', 'instructor_view_rights': 'false', 'dispatch_view_rights': 'false', 'admin_view_rights': 'false'})
            .end(function (err, res) {
                chai.expect(err).to.not.exist;
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });
});
