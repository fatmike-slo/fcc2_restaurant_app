var express = require('express');
var router = express.Router();
let Db = require("./../db/db.js")
// promise handler
let Request = require("request");
const fs = require("fs");
const yelp = require("yelp-fusion");

// root--------------------------------------------------
router.get('/', (req, res) => {

    if (req.session.searchPerformed === true) {
        res.render("index", {
            searchPerformed: true,
            data: req.session.searchData
        });
    } else {
        res.render("index", {});
    }
});

// search -------------------------------------------
router.post('/search', (req, res) => {
    console.log('------------- dashboard/search POST ----------------');


    if (!req.session.loggedOut) {



        let userSearch = req.body.search
        const token = process.env.YELPTOKEN;

        // find yelp result and compare them if same data is present in db
        yelpClient.search({
            term: 'restaurant',
            location: userSearch
        }).then(response => {
            // SESSION SearchPerformed ACTIVATED, global scope
            req.session.searchPerformed = true;
            let yelpData = JSON.parse(response.body);
            let searchData = yelpData.businesses;
            searchData.forEach((item) => {
                item.count = 0;
            });

            Db.viewRestaurants((err, data) => {
                if (err) {
                    console.log(err);
                }
                // if there are no entries found in db
                if (data.length !== 0) {
                    // search if a restaurant in api reposnse is already in restaurant database
                    searchData.forEach((yelpItem, index) => {
                        // add populated restaurant to the sending array
                        data.forEach((dbItem) => {
                            if (dbItem.name === yelpItem.name) {
                                yelpItem.count = dbItem.count;
                                yelpItem.usersGoing = dbItem.whoIsGoing;
                            }
                        });
                    });
                    // SESSION searchData Created
                    req.session.searchData = searchData;
                    res.redirect("/");

                } else {
                    //if we find entry in db
                    // podamo naprej SESSION PERFOMED SEARCH IN SESSION SEARCH DATA ---> NA "/"
                    req.session.searchData = searchData;
                    res.redirect("/");
                }
            });
        }).catch(e => {
            console.log(e);
        });
    }
    else {
        res.render("index");
    }
});


// logout -----------------------------------------------
router.get('/logout', (req, res) => {
    req.session.loggedOut = true;
    req.session.username = "";
    req.session.searchData = {};
    req.session.searchPerformed = false;
    console.log("logged out: session cleared->", req.session);
    res.redirect("/");
});

module.exports = router;
