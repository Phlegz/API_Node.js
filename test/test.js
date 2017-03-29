'use strict';

const
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    servicePath = 'http://localhost:3000';

chai.use(chaiHttp);

describe('API', function() {
    it('returns all the events', function() {
        return chai.request(servicePath)
            .get('/api/events')
            .then(function (res) {
                chai.expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            });
    });
    it('returns a single event if id is valid', function() {
        return chai.request(servicePath)
            .get('/api/events/3')
            .then(function (res) {
                chai.expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            });
    });
    // it('returns a single event if id is not valid', function() {
    //     return chai.request(servicePath)
    //         .get('/api/events/3')
    //         .then(function (res) {
    //
    //           chai.expect(res).to.have.status(404)
    //
    //         })
    //         .catch(function (err) {
    //           console.log(err);
    //           chai.expect(true).to.be.true
    //           console.log(err.response.statusCode);
    //         });
    // });

});
