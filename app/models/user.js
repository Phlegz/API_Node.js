'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
  username: { type: String, required: true },
  emailAddress: { type: String, required: true },
  password: { type: String, required: true},
  fullName: { type: String, required: true }
})

module.exports = mongoose.model('user', userSchema)