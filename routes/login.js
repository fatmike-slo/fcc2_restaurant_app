var express = require('express');
var router = express.Router();
let Db = require("./../db/db.js")

// login post 
router.post("/", (req,res)=> {
    let username = req.body.username;
    let password = req.body.password;
    
    Db.validateUser(username, password, (err,data)=> {
        // login error, no user founded
        if(err) {
            console.log("error retrieving user from database: ", err);
        }
        else {
            let errObj = [{msg:"Login Failed"}]
            
            // if login successfull
            if(data !== null) {
                console.log('smo se logirali');
                
                // success!
                // SESSIONs created
                req.session.username = username;
                res.redirect("/dashboard/" + username);
                }
            // if login fails, display fail message
            else {
                // SESSION ERROR CREATED --> sended to index.js
                console.log('nismo uspeli se logirat');
                res.render("index", {
                    errors: errObj
                })
            }
            // SESSION ERROR destroyed
            req.session.error = false;
        }
    });
});



module.exports = router;