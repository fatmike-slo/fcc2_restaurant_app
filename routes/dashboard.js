const express = require('express');
const router = express.Router();
const Db = require("./../db/db.js")
const yelp = require("yelp-fusion");


router.get("/:user", (req, res) => {
    let username = req.params.user;
    console.log('---------dashboard/user GET---------------------');



    if (req.session.username) {
        if (req.session.loginSuccess === true) {
            console.log('1');
            res.render("dashboard", {
                username: username
            });
        }
        // search data injected
        else if (req.session.searchPerformed === true) {
            console.log('2');
            res.render("dashboard", {
                username: username,
                searchPerformed: req.session.searchPerformed,
                data: req.session.searchData
            });

        } else {
            console.log('3');

            // normal login
            res.render("dashboard", {
                username: username
            });
        }
    } else {
        // if not logged in, back to index and reset session
        req.session = null;
        res.redirect("/");
    }
});

// search post route
router.post("/search", (req, res) => {
    console.log('------------- dashboard/search POST ----------------');
    let username = req.session.username;
    // userSearch = user input on location
    let userSearch = req.body.search
    const token = process.env.YELPTOKEN;
    const yelpClient = yelp.client(token);


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
                res.redirect("/dashboard/" + username);

            } else {
                //if we find entry in db
                // podamo naprej SESSION PERFOMED SEARCH IN SESSION SEARCH DATA ---> NA "/dashboard"
                req.session.searchData = searchData;
                res.redirect("/dashboard/" + username);
            }
        });
    }).catch(e => {
        console.log(e);
    });
});

// add records of username and count to db for selected restaurant
router.post('/going/:restaurantChosen', (req, res, next) => {
    let restaurantChosen = req.params.restaurantChosen;
    let username = req.session.username;
    let sessionData = req.session.searchData;

    // SESSION SearchPerformed ACTIVATED, passing to dashboard
    req.session.searchPerformed = true

    Db.isRestaurant(restaurantChosen, (err, restaurant) => {
        if (err) {
            console.log(err);
        }
        // if restaurant found
        if (restaurant) {
            if (restaurant.whoIsGoing.length > 0) {
                let userFound = false;
                restaurant.whoIsGoing.forEach((match) => {
                    if (match === username) {
                        userFound = true;
                        // cannot log more than one user, send naked
                        res.redirect("/dashboard/" + username);
                    }
                });
                if(userFound === false) {
                    Db.updateRestaurant(restaurantChosen, username, (err, updatedRestaurant) => {
                        if (err) {
                            console.log(err);
                        }
                        sessionData.forEach((sessionRestaurant) => {
                            if (sessionRestaurant.name === updatedRestaurant.name) {
                                // preslikamo count in whoisgoing na session item
                                sessionRestaurant.count = updatedRestaurant.count;
                                sessionRestaurant.usersGoing = updatedRestaurant.whoIsGoing;
                                res.redirect("/dashboard/" + username);
                            }
                        });
                    });
                }
            }

        }
        // if restaurant NOT found
        else {
            console.log("not founded, creating new");
            Db.createRestaurant(restaurantChosen, username, 1, (err, newRestaurant) => {
                if (err) {
                    console.log(err);
                }
                if (newRestaurant) {
                    sessionData.forEach((match) => {
                        if (match.name === newRestaurant.name) {
                            match.count = newRestaurant.count;
                            match.usersGoing = [username];
                            res.redirect("/dashboard/" + username);
                        }
                    });
                } else {
                    console.log("restaurant NOT created");
                }
            });
        }
    });
});


module.exports = router;