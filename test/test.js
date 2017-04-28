'use strict'

const
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    servicePath = 'http://localhost:3000'

chai.use(chaiHttp)

describe('API', function() {
    it('returns all the events', function() {
        return chai.request(servicePath)
            .get('/api/events')
            .then(function (res) {
                chai.expect(res).to.have.status(200)
            })
            .catch(function (err) {
                throw err
            })
    })

    it('returns 200 if id is valid and exists', function() {
        return chai.request(servicePath)
            .get('/api/events/58f042fcf36d2878e4391a03')
            .then(function (res) {
                chai.expect(res).to.have.status(200)
            })
            .catch(function (err) {
                throw err 
            })
    })

    it('returns 404 if id is valid and does not exist', function() {
        return chai.request(servicePath)
            .get('/api/events/58f042fcf36d2878e4391a04')
            .then(function (res) {
                chai.assert.fail(0, 1, "invalid event id returned valid http status")
            })
            .catch(function (err) {
                chai.expect(err).to.have.property("response")
                chai.expect(err.response.statusCode).to.eq(404)
            })
    })

    it('create an event', function() {
        const event = {title:'something',description:'description',date:'date'}
        return chai.request(servicePath)
            .post('/api/events')
            .send(event)
            .then(function (res) {
                chai.expect(res).to.have.status(201)
                return chai.request(servicePath).get(res.headers.location)
            })
            .then(function (res) {
              chai.assert.equal(res.body.title,event.title)
            })
            .catch(function (err) {
                throw err
            })
    })
})
