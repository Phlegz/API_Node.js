'use strict'
const event = require('../models/event')
const user = require('../models/user')

function getEvents(req, res) {
  let searchCriteria = {}

  if(req.query.title) {
    searchCriteria.title = new RegExp(req.query.title, 'i')
  }

  if(req.query.createdBy) {
    searchCriteria.username = req.query.createdBy
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
  newEvent.username = req.user.username
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
      if (event.username !== req.user.username) {
        res.status(403).json({message: "Cannot update event that you did not create."})
        return
      }

       let obj = Object.assign(event,req.body)
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
  event.remove({"_id": req.params.id, "username": req.user.username})
    .then( result => {
      res.sendStatus(202)
    })
    .catch( err => {
      res.status(500).json({message:err})
    })
}

function updateEventRSVP(req,res) {
  let query = event.findById(req.params.id)
  query
    .then( event => {
        if(!(event.rsvp.includes(req.user.username))) {
          event.rsvp.push(req.user.username)
        }
       return event.save()
    })
    .then( event => {
      res.status(200).json(event)
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({message: err})
    })
}

function deleteEventRSVP(req,res) {
  let query = event.findById(req.params.id)
  query
    .then( event => {
        let index = event.rsvp.indexOf(req.user.username)
        if(index !== -1) {
          event.rsvp.splice(index,1)
        }
       return event.save()
    })
    .then( event => {
      res.status(200).json(event)
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({message: err})
    })
}

function getUserRSVP(req,res) {
  let query = event.find({ rsvp: [req.params.username] })
  query
    .then(events => {
      res.status(200).json(events)
    })
    .catch( err => {
      console.log(err)
      res.status(500).json({message: err})
    })
}

module.exports = {getEvents, getEvent, postEvent, updateEvent, deleteEvent, updateEventRSVP, deleteEventRSVP, getUserRSVP}
