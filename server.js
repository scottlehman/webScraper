var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var app = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

// var PORT = 3000;

// mongoose.connect("mongodb://webscraper:gtf0utnubz@ds153093.mlab.com:53093/heroku_f2xzqbtd", {useNewUrlParser: true});

// Connect to the Mongo DB
const CONNECTION_STRING = process.env.MONGODB_URI || "mongodb://localhost/outside_scrape";
mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true });

var app = express();
app.use(express.static("public"));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.engine("handlebars", exphbs({ defaultLayout: "main"}));
// app.set("view engine", "handlebars");

app.get("/scrape", function (req, res) {

    axios.get("http://www.digg.com/").then(function (response) {
        console.log(response);
        var $ = cheerio.load(response.data);

        $("div h2").each(function(i, element) {
            var result = {};

            result.title = $(this)
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
    console.log("App running on port " + CONNECTION_STRING);
})