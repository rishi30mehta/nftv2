var express = require("express")
var app = express()

const AppDAO = require('./dao')
const TokenRepository = require('./model');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

const dao = new AppDAO('./database.db');
const tokenRepo = new TokenRepository(dao);


app.get("/api/holders", (req, res, next) => {
    tokenRepo.getRecieverTokenCountAll().then((rows) => {
        res.json({
            "message":"success",
            "data":rows
        })})
});


app.get("/api/holder/:id", (req, res, next) => {
    var holderId = req.params.id
    tokenRepo.getByReceiverId(holderId).then((row) => {
        res.json({
            "message":"success",
            "data":row
        })
    })
});

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
