'use strict'
const
  config = require('./_config'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),
  user = require('./app/models/user.js'),
  eventsRoutes = require('./app/routes/events.js'),
  passport = require('passport'),
  basicStrategy = require('passport-http').BasicStrategy,
  nodeAcl = require('acl');

passport.use(new basicStrategy(
  function(username, password, cb) {
    user.findOne({username: username}, function(err, user) {
      if (err) { return cb(err) }
      if (!user) { return cb(null, false) }
      if (user.password != password) { return cb(null, false) }
      return cb(null, user)
    })
  }))

// *** mongoose *** ///
mongoose.connect(config.mongoURI[app.settings.env])

let db = mongoose.connection;
let acl;


app.use(bodyParser.json()) // configure app to use bodyParser(). this will let us get the data from a POST

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  app.listen(3000, () => {
    acl = new nodeAcl(new nodeAcl.mongodbBackend(db.db, "acl_"));
    initializeRoles(acl);
    initializeRoutes();
    console.log(`Example app listening on port 3000!', 'Connected to Mongo DB ${config.mongoURI[app.settings.env]}`)
  })
})

function initializeRoles(acl) {
  acl.allow([
      {
          roles:['guest'],
          allows:[
              {resources:'/api/events', permissions:'get'},
          ]
      },
      {
          roles:['user'],
          allows:[
              {resources:'/api/events', permissions:['get', 'post', 'put', 'delete']},
          ]
      },
      {
          roles:['admin'],
          allows:[
              {resources:'/api/events', permissions:'*'},
          ]
      }
  ])

  acl.addUserRoles('test', 'admin')
  acl.addUserRoles('admin', 'admin')
}

function initializeRoutes() {
  // on routes that end in /events------------------------------------------------------------
  app.route('/api/events')
    .get(passport.authenticate('basic', { session: false }), acl.middleware(2, getUserName), eventsRoutes.getEvents)
    .post(passport.authenticate('basic', { session: false }), acl.middleware(2, getUserName), eventsRoutes.postEvent)

  // on routes that end in /events/id ------------------------------------------------------------
  app.route('/api/events/:id')
    .get(passport.authenticate('basic', { session: false }), acl.middleware(2, getUserName), eventsRoutes.getEvent)
    .put(passport.authenticate('basic', { session: false }), acl.middleware(2, getUserName), eventsRoutes.updateEvent)
    .delete(passport.authenticate('basic', { session: false }), acl.middleware(2, getUserName), eventsRoutes.deleteEvent)
}

function getUserName(request, response) {
  return request.user && request.user.username || false
}

