var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request")
var axios = require("axios")


// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/MongoDBHW");
mongoose.connect("mongodb://heroku_mddfp0f2:tWPlvar0SvpwqqVorhICuzhS3EUhiq6T@ds125831.mlab.com:25831/heroku_mddfp0f2");

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".story-heading").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href")
      result.summary = $(this).siblings(".summary").text().trim()

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}, function(err,data){
    if(err) throw err;

    res.json(data);
  })
});

// Route for getting all saved Articles from the db
app.get("/articles/saved", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({saved: true}, function(err,data){
    if(err) throw err;

    res.json(data);
  })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.find(
    {
      _id: req.params.id
    }
    )
    .populate("note")
    .then(function(dbArticle){
      res.json(dbArticle)
    })
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  var note =  req.body
  db.Note.create(note)
    .then(function(dbNote){
      db.Article.update({_id: req.params.id}, {$set: {note: dbNote._id}}, function(err, data){
        if(err) throw err
          res.json(data)
      })
    })
})

app.post("/articles/delete/:id", function(req, res) {
  db.Note.remove({_id: req.params.id})
    .then(function(data){
      res.json(data);
    })
})

app.post("/articles/save/:id", function(req, res) {
  console.log(req.params.id)
  db.Article.update({_id: req.params.id}, {$set: {saved: true}}, function(err, data){
    if(err) throw err
    console.log(data)
    res.json(data)
  })
});

app.post("/articles/unsave/:id", function(req, res) {
  console.log(req.params.id)
  db.Article.update({_id: req.params.id}, {$set: {saved: false}}, function(err, data){
    if(err) throw err
    console.log(data)
    res.json(data)
  })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
