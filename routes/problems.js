const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://admin:admin@cluster0-pkujn.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const db = "pmanager";
const collectionName = "problems";


// let create_questions_table = 'CREATE TABLE IF NOT EXISTS questions(id INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL, description TEXT, created_at Timestamp DEFAULT CURRENT_TIMESTAMP, updated_at Timestamp)';
// let create_options_table = 'CREATE TABLE options(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, qid INTEGER, description TEXT, lable TEXT, CONSTRAINT fk_questions FOREIGN KEY (qid) REFERENCES questions(id), created_at Timestamp DEFAULT CURRENT_TIMESTAMP, updated_at Timestamp)';
// let create_answers_table = 'CREATE TABLE answers(qid INTEGER UNIQUE, oid INTEGER, CONSTRAINT fk_questions FOREIGN KEY (qid) REFERENCES questions(id), created_at Timestamp DEFAULT CURRENT_TIMESTAMP, updated_at Timestamp)';
// let get_all_questions = "SELECT questions.id, questions.question_text, questions.correct_answer_id, questions.created_at, questions.updated_at, options.id, options.qid, options.description, options.lable FROM questions JOIN options ON questions.id = options.qid ";
// let get_all_answers = "SELECT * FROM answers ";

// db.serialize(function() {
//   db.run(create_questions_table);
//   db.run(create_options_table);
//   db.run(create_answers_table);
// });

router.get('/', function(req, res, next) {
  client.connect(err => {
    if(err) {
      res.send("Error while connecting " + err);
    }
    const collection = client.db(db).collection(collectionName);
    let docs = [];
    collection.find({}).forEach(function(doc) {
      // handle
      docs.push(doc);
    }, function(err) {
      // done or error
      //client.close();
      if(err) {
        res.send(err)
      } else {
        res.json(docs);
      }
    });
  })
  // let allQuestions = [];
  // db.get(get_all_questions, function(err, row) {
  //   db.get(get_all_answers, function(err1, res1) {
  //     console.log(row, res1);
  //     console.log('=========');
  //     res.json({q: row, ans: res1});
  //   });
  // });
});

router.get('/:id', function(req, res, next) {
  client.connect(err => {
    const collection = client.db(db).collection(collectionName);
    let docs = [];
    collection.find({_id: ObjectId(req.params.id)}).forEach(function(doc) {
        // handle
        docs.push(doc);
      }, function(err) {
        // done or error
        client.close();
        if(err) {
          res.send(err)
        } else {
          res.json(docs);
        }
      });
  })
  // let q = get_all_questions + " WHERE questions.id = " + req.params.id;
  // db.get(q, function(err, row) {
  //   console.log(row);
  //   res.json(row);
  // })
});

router.post('/', function(req, res, next) {
  let q = req.body;
  client.connect(err => {
    const collection = client.db(db).collection(collectionName);
    collection.insert(q);
    res.send("Insert successful");
  })
});

router.put('/', function(req, res, next) {
  let q = req.body;
  if(q._id) {
    client.connect(err => {
      const collection = client.db(db).collection(collectionName);
      collection.updateOne(
        { _id: ObjectId(q._id)},
        {
          $set: { description: q.description, options: q.options, answer: q.answer, title: q.title },
          $currentDate: { lastModified: true }
        }
      )
      res.send("Update successful");
    })
  } else {
    res.send("Error in data, id is not provided");
  }
});
router.delete('/:id', function(req, res, next) {
  if(req.params.id) {
    client.connect(err => {
      const collection = client.db(db).collection(collectionName);
      collection.deleteOne({_id: ObjectId(req.params.id)})
    })
    res.send("Delete successful");
  } else {
    res.send("Error in data, id is not provided");
  }
})

module.exports = router;
