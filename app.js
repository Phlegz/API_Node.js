'use strict'
const
  MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectId,
  bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),
  router = express.Router(), // get an instance of the express Router
  dbName = process.argv[2] === "test" ? "database-nodecourse-test" : "database-nodecourse";

let db;

app.use(bodyParser.json()); // configure app to use bodyParser(). this will let us get the data from a POST
app.use('/api', router); // register our routes. All the routes will be prefixed with /api

MongoClient.connect(`mongodb://app:app@ds062059.mlab.com:62059/${dbName}`, (err, connection) => {
  if (err) {
    console.log("ERROR:", err);
    return;
  }

  db = connection;
  app.listen(3000, () => {
    console.log(`Example app listening on port 3000!', 'Connected to Mongo DB ${dbName}`)
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

// on routes that end in /events------------------------------------------------------------
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

// on routes that end in /events/id ------------------------------------------------------------
router.route('/events/:id')
  .get((req,res) => {
    let id;
    try {
      id = ObjectId(req.params.id);
    }
    catch (err) {
      res.status(400).end()
      return;
    }
    db.collection("events").findOne({"_id":id})
      .then(result => result ? res.status(200).json(result) : res.status(404).send())
      .catch(err => res.status(500).json({message: err}));
  })

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
