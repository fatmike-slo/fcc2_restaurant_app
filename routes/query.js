var express = require('express');
var router = express.Router();
let Db = require("./../db/db.js")
let Request = require("request");
const fs = require("fs");

/* GET home page. */
//key
//location
//rankby=distance
let key2 = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Koper&key=" + process.env.GOOGLEAPIKEY + "";
//

router.post("/", (req, res) => {


    
    Request(key2, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body) // Print the google web page.
          res.json(JSON.parse(body));
      }
    })


});


module.exports = router;