'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default:() => new Date()},
})

module.exports = mongoose.model('event', eventSchema);
