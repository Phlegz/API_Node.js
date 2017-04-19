'use strict'
const
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),
  eventsRoutes = require('./app/routes/events.js')

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
app.route('/events')
  .get(eventsRoutes.getEvents)
  .post(eventsRoutes.postEvent)

// on routes that end in /events/id ------------------------------------------------------------
app.route('/events/:id')
  .get(eventsRoutes.getEvent)
  .put(eventsRoutes.updateEvent)
  .delete(eventsRoutes.deleteEvent)
