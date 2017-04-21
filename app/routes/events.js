'use strict'
const event = require('../models/event')

function getEvents(req, res) {
  let searchCriteria = {}
  if(req.query.title) {
    searchCriteria.title = new RegExp(req.query.title, 'i')
  }
  let query = event.find(searchCriteria)
  query
    .then( events => {
      res.status(200).json(events)
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({message: err})
    })
}

function getEvent(req, res) {
  let query = event.findById(req.params.id)
  query
    .then( event => {
      res.status(200).json(event)
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({message: err})
    })
}

function postEvent(req, res) {
  let newEvent = new event(req.body)
  newEvent.save()
    .then( event => {
      res.status(201).json(event)
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({message: err})
    })
}

function updateEvent(req, res) {
  let query = event.findById(req.params.id)
  query
    .then( event => {
       let obj = Object.assign(event,req.body)
console.log(obj);
       return obj.save()
    })
    .then( event => {
      res.status(200).json(event)
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({message: err})
    })
}

function deleteEvent(req, res) {
  event.remove({"_id": req.params.id})
    .then( result => {
      res.sendStatus(202)
    })
    .catch( err => {
      res.status(500).json({message:err})
    })
}

module.exports = {getEvents, getEvent, postEvent, updateEvent, deleteEvent}
