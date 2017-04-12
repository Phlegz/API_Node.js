'use strict'
const
  MongoClient = require('mongodb').MongoClient,
  bodyParser = require('body-parser'),
  express = require('express');

const app = express();
app.use(bodyParser.json())

let db;
MongoClient.connect('mongodb://localhost:27017/database', (err, connection) => {
  if (err) {
    console.log("ERROR:", err);
    return;
  }

  db = connection;
  app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
  });
})

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

app.post('/api/events', (req, res) => {
  let event = req.body;
  db.collection("events").insertOne(event).then(result => {
    res.location(`/api/events/${result.insertedId}`)
    res.send(201);
  }).catch(err => {
    res.status(500).json({message: err});
  })
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


