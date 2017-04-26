'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let eventSchema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true, index:{unique: true}},
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default:() => new Date()},
  rsvp: {type: Array}
})

module.exports = mongoose.model('event', eventSchema)
