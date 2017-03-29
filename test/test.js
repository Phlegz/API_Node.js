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

    it('returns a single event if id is not valid', function() {
        return chai.request(servicePath)
            .get('/api/events/0')
            .then(function (res) {
                chai.assert.fail(0, 1, "invalid event id returned valid http status");
            })
            .catch(function (err) {
                chai.expect(err).to.have.property("response");
                chai.expect(err.response.statusCode).to.eq(404);
            });
    });

    it('create an event', function() {
        const event = {title:'something',description:'description',date:'date'};
        return chai.request(servicePath)
            .post('/api/events')
            .send(event)
            .then(function (res) {
                chai.expect(res).to.have.status(201);
                return chai.request(servicePath).get(res.headers.location);
            })
            .then(function (res) {
              chai.assert.equal(res.body.title,event.title);
            })
            .catch(function (err) {
                throw err;
            });
    });

});
