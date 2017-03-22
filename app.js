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
app.post('/', (req, res) => {
  req.on('data', (data) => {
    console.log(data.toString('utf8'));
  });
  res.status(204).end();
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
