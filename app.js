'use strict'
const express = require('express');
const app = express();

class someEvent {
  constructor (id, title, description, date) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
  }
}
// Test data----------------------------------------------------
let data = []
data.push(new someEvent(1,'student','description','today'))
data.push(new someEvent(2,'prof','description','yesterday'))
data.push(new someEvent(3,'doctor','description','tomorrow'))
data.push(new someEvent(4,'Engineer','description','never'))
// --------------------------------------------------------------

app.get('/api/events', (req, res) => {
  res.status(200).json(data);
});

app.get('/api/events/:id', (req, res) => {
  let index = data.findIndex((event) => {
      return +req.params.id === event.id;
  });

  if (index !== -1) {
      res.status(200).json(data[index]);
  }
  else {
      res.sendStatus(404);
  }
});

// TODO: Adding a body parser in the app.post so making an exception in req.on would not yield the statusCode of 201.
app.post('/api/events', (req, res) => {
  let bodyContent = '';
  req.setEncoding('utf8');

  req.on('data', (data) => {
    bodyContent += data;
  });

  req.on('end', () => {
    let jsonContent = JSON.parse(bodyContent);
    data.push(new someEvent(data.length+1, jsonContent.title, jsonContent.description, jsonContent.date));
    res.location(`/api/events/${data.length}`)
    res.sendStatus(201);
  });
});

app.put('/api/events/:id', (req, res) => {
  let bodyContent = '';
  req.setEncoding('utf8');

  req.on('data', (data) => {
    bodyContent += data;
  });

  req.on('end', () => {
    let jsonContent = JSON.parse(bodyContent);
    let index = data.findIndex((event) => {
      return +req.params.id === event.id;
    });
    if (index !== -1) {
      delete jsonContent.id;
      Object.assign(data[index],jsonContent);
      res.sendStatus(202);
    }
    else {
      res.sendStatus(404);
    }
  });
});

app.delete('/api/events/:id', (req, res) => {
    let index = data.findIndex((event) => {
      return +req.params.id === event.id;
    });

    if (index !== -1) {
      data.splice(index, 1);
      res.sendStatus(202);
    }
    else {
      res.sendStatus(404);
    }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
