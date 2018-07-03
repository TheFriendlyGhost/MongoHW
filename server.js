var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request")
var axios = require("axios")
mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));
// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/MongoDBHW");
mongoose.connect("mongodb://heroku_mddfp0f2:tWPlvar0SvpwqqVorhICuzhS3EUhiq6T@ds125831.mlab.com:25831/heroku_mddfp0f2");

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected');
    app.listen(PORT, function() {
        console.log('listening on ' + PORT);
    });
});

require('./controller/app_controller.js')(app);
