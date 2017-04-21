'use strict'
const
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),
  user = require('./app/models/user.js'),
  eventsRoutes = require('./app/routes/events.js'),
  passport = require('passport'),
  basicStrategy = require('passport-http').BasicStrategy

passport.use(new basicStrategy(
  function(username, password, cb) {
    user.findOne({username: username}, function(err, user) {
      if (err) { return cb(err) }
      if (!user) { return cb(null, false) }
      if (user.password != password) { return cb(null, false) }
      return cb(null, user)
    })
  }))

app.use(bodyParser.json()) // configure app to use bodyParser(). this will let us get the data from a POST

const config = require('./_config')

// *** mongoose *** ///
mongoose.connect(config.mongoURI[app.settings.env])

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  app.listen(3000, () => {
    console.log(`Example app listening on port 3000!', 'Connected to Mongo DB ${config.mongoURI[app.settings.env]}`)
  })
})

// on routes that end in /events------------------------------------------------------------
app.route('/api/events')
  .get(passport.authenticate('basic', { session: false }), eventsRoutes.getEvents)
  .post(passport.authenticate('basic', { session: false }), eventsRoutes.postEvent)

// on routes that end in /events/id ------------------------------------------------------------
app.route('/api/events/:id')
  .get(passport.authenticate('basic', { session: false }), eventsRoutes.getEvent)
  .put(passport.authenticate('basic', { session: false }), eventsRoutes.updateEvent)
  .delete(passport.authenticate('basic', { session: false }), eventsRoutes.deleteEvent)
