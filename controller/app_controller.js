var Article = require('../models/Article');
var Note = require('../models/Note');
var cheerio = require('cheerio');
var request = require('request');


module.exports = function(app){
	app.get("/scrape", function(req, res) {
	  request("https://www.nytimes.com/"), function(_error, _response, html) {
	    var $ = cheerio.load(html);

	    $(".story-heading").each(function(i, element) {
	      var result = {};

	      result.title = $(this).children("a").text();
	      result.link = $(this).children("a").attr("href")
	      result.summary = $(this).siblings(".summary").text().trim()

	      Article.create(result)
	        .then(function(dbArticle) {
	          console.log(dbArticle);
	        })
	        .catch(function(err) {
	          return res.json(err);
	        });
	    });

	    // If we were able to successfully scrape and save an Article, send a message to the client
	    res.send("Scrape Complete");
	  };
	});

	// Route for getting all Articles from the db
	app.get("/articles", function(req, res) {
	  // TODO: Finish the route so it grabs all of the articles
	  Article.find({}, function(err,data){
	    if(err) throw err;

	    res.json(data);
	  })
	});

	// Route for getting all saved Articles from the db
	app.get("/articles/saved", function(req, res) {
	  // TODO: Finish the route so it grabs all of the articles
	  Article.find({saved: true}, function(err,data){
	    if(err) throw err;

	    res.json(data);
	  })
	});

	// Route for grabbing a specific Article by id, populate it with it's note
	app.get("/articles/:id", function(req, res) {
	  Article.find(
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
	  Note.create(note)
	    .then(function(dbNote){
	      Article.update({_id: req.params.id}, {$set: {note: dbNote._id}}, function(err, data){
	        if(err) throw err
	          res.json(data)
	      })
	    })
	})

	app.post("/articles/delete/:id", function(req, res) {
	  Note.remove({_id: req.params.id})
	    .then(function(data){
	      res.json(data);
	    })
	})

	app.post("/articles/save/:id", function(req, res) {
	  console.log(req.params.id)
	  Article.update({_id: req.params.id}, {$set: {saved: true}}, function(err, data){
	    if(err) throw err
	    console.log(data)
	    res.json(data)
	  })
	});

	app.post("/articles/unsave/:id", function(req, res) {
	  console.log(req.params.id)
	  Article.update({_id: req.params.id}, {$set: {saved: false}}, function(err, data){
	    if(err) throw err
	    console.log(data)
	    res.json(data)
	  })
	});
}