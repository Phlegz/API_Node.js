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
});

