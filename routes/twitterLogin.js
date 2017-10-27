let express = require("express");
let router = express.Router();


const passport = require("passport");
const Strategy = require("passport-twitter").Strategy;


// 1. define strategy (my passwords, callback)
passport.use(new Strategy({
    consumerKey: process.env.TWITTERKEY,
    consumerSecret: process.env.TWITTERSECRET,
    callbackURL: process.env.TWITTERCALLBACKURL,
  }, (token, tokenSecret, profile, callback) => {
    return callback(null, profile);
  }));
  // 2. process callback
  passport.serializeUser((user, callback) => {
    callback(null, user)
  });
  passport.deserializeUser((obj, callback) => {
    callback(null, obj);
  });
  // 3. twitter login routes 
  router.get("/login", passport.authenticate("twitter"));
  router.get("/callback", passport.authenticate("twitter", {
    failureRedirect: "/index"
  }), (req, res) => {
    console.log(req.query);
    
  
    // save username from api, callback pass it to /dashboard
    req.session.twitterSession = true;
    req.session.username = req.user.displayName;
    res.redirect("/dashboard/"+req.session.username);
  });

  module.exports = router;