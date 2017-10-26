const express = require('express');
const router = express.Router();
const Db = require("./../db/db.js")

// register view ---------------------------
router.get("/", (req, res) => {
    res.render("register", {
        errors: false
    });
});

// resiter post  ---------------------------
router.post("/", (req, res) => {

    let check = req.validationErrors();
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let passwordConfirm = req.body.passwordConfirm;

    req.check("username", "Username must be at least 3 characters long").isLength({
        min: 3
    });
    req.check("email", "Invalid email address").isEmail();
    req.check("password", "Invalid passwords match").equals(passwordConfirm);

    let errors = req.validationErrors();
    //if string check by validator don't pass test
    if (errors) {
        res.render("register", {
            errors: errors
        });
    } else {
        let getDate = new Date();
        // if string check is good, check if username aldy taken
        Db.createUsers(username, email, password, getDate.toLocaleString(), (err, data) => {
            // if duplicates username string
            if (err) {
                errObj = [{
                    msg: "Username already in use"
                }];
                res.render("register", {
                    errors: errObj
                });
            }
            // if no duplicates username found, go ahead
            else {
                console.log('vse mega???');
                // SESSION USERNAME CREATED --> sending to dashboard 
                req.session.username = username
                res.redirect("/dashboard/" + username);
            }
        });
    }
});

module.exports = router;