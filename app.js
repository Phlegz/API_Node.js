'use strict'
const
  MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectId,
  bodyParser = require('body-parser'),
  express = require('express'),
  router = express.Router();

const app = express();
app.use(bodyParser.json());

app.use('/api', router);

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

router.route('/events')
  .post((req, res) => {
    let event = req.body;
    db.collection("events").insertOne(event).then(result => {
      res.location(`/api/events/${result.insertedId}`)
      res.send(201);
    }).catch(err => {
      res.status(500).json({message: err});
    })
  })

  .get((req,res) => {
      db.collection("events").find().toArray().then(docs => {
        res.status(200).json(docs);
        console.log(docs);
      })
  })

router.route('/events/:id')
  .put((req,res) => {
    let id;
    try {
      id = ObjectId(req.params.id);
    }
    catch (err) {
      res.status(400).end()
      return;
    }
    db.collection("events").replaceOne(
      {"_id": id},
      req.body,
      {upsert: true}
    ).then(result => {
      //[TODO] Have response info include whether the event was inserted or updated
      res.status(200).end()
      console.log(result);
    })
    .catch(err => {
      res.status(500).end()
      console.log(err);
    })
  })

  .delete((req,res) => {
    let id;
    try {
      id = ObjectId(req.params.id);
    }
    catch (err) {
      res.status(400).end()
      return;
    }
    db.collection("events").deleteOne( {"_id": id}).then(result => {
      res.status(202).end();
    })
    //[TODO] Check result to see if the object is actually deleted and return a better response to user
    .catch(err => {
      res.status(500).json({message:err}).end()
    })
  });
