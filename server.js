var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 8080;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://eyedrops:gtf0utnubz@ds119394.mlab.com:19394/heroku_mml8g4gg", { 
    useNewUrlParse: true 
}, function(error){
    if(error) {
        console.log(error);
    } else{
        console.log("Connected to database");
    }
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.reddit.com/r/technology/new/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function (i, element) {
            var result = {};

            result.headline = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err)
                });
        });
    });
    res.send("scrape complete");
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT);
})