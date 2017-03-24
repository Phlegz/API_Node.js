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
  res.json(data);
});

app.get('/api/events/:id', (req, res) => {
  const id = req.params.id;

  if (id > 0 && id <= data.length) {
    res.json(data[id-1]);
  } else {
    res.status(400).end();
  }

});

app.post('/api/events', (req, res) => {
  let bodyContent = '';
  req.setEncoding('utf8');

  req.on('data', (data) => {
    bodyContent += data;
  });

  req.on('end', () => {
    let jsonContent = JSON.parse(bodyContent);
    data.push(new someEvent(data.length+1, jsonContent.title, jsonContent.description, jsonContent.date));
  });

  res.sendStatus(204);
});

app.put('/api/events', (req, res) => {
  let bodyContent = '';
  req.setEncoding('utf8');

  req.on('data', (data) => {
    bodyContent += data;
  });

  req.on('end', () => {
    let jsonContent = JSON.parse(bodyContent);
    let index = data.findIndex((event) => {
      return jsonContent.id === event.id;
    });
    if (index !== -1) {
      Object.assign(data[index],jsonContent);
      res.sendStatus(202);
    }
    else {
      res.sendStatus(404);
    }
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
