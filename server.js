var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var BLOGS_COLLECTION = "blogs";

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = client.db();
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/api/blogs", function(req, res) {
  db.collection(BLOGS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get blogs.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/blogs", function(req, res) {
  var newBlog = req.body;
  newBlog.createDate = new Date();

  if (!req.body.title) {
    handleError(res, "Invalid user input", "Must provide a title.", 400);
  } else if (!req.body.author) {
    handleError(res, "Invalid user input", "Must provide an author.", 400);
  } else if (!req.body.content) {
    handleError(res, "Invalid user input", "Must provide content.", 400);
  } else {
    db.collection(BLOGS_COLLECTION).insertOne(newBlog, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new blog.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

app.get("/api/blogs/:id", function(req, res) {
  db.collection(BLOGS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get blog");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/blogs/:id", function(req, res) {
  var updateDoc = req.body;

  if (!req.body.title) {
    handleError(res, "Invalid user input", "Must provide a title.", 400);
  } else if (!req.body.author) {
    handleError(res, "Invalid user input", "Must provide an author.", 400);
  } else if (!req.body.content) {
    handleError(res, "Invalid user input", "Must provide content.", 400);
  } else {
    //delete updateDoc._id;
    db.collection(BLOGS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, result) {
      if (err) {
        handleError(res, err.message, "Failed to update blog");
      } else {
        updateDoc._id = req.params.id;
        res.status(200).json(updateDoc);
      }
    });
  }
});

app.delete("/api/blogs/:id", function(req, res) {
  db.collection(BLOGS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete blog");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});
