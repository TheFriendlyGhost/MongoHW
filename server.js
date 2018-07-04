var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request")
var axios = require("axios")
mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/MongoDBHW";
var app = express();

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));
// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/MongoDBHW");
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected');
    app.listen(PORT, function() {
        console.log('listening on ' + PORT);
    });
});

require('./controller/app_controller.js')(app);
