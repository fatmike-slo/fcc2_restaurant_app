const express = require('express');
const router = express.Router();
const Db = require("./../db/db.js");

// user routes ------------------------------------------------------
router.get("/viewUsers", (req,res)=> {
    Db.viewUsers((err,data)=> {
        res.json(data);
    })
});

router.get("/searchUser", (req,res)=> {
    Db.validateUser("fast", "fat@mail.co", (err,data)=> {
        if(err) {
            res.send("ola")
            console.log('wondi, err', err);
        }
        else {
            console.log('passed');
            res.json(data);
        }
    });
});

router.get("/deleteUsers", (req,res)=> {
    Db.deleteAllUsers((err,data)=> {
        if(err) {
            res.send("cannon delete")
        }
        res.send("deleted")
    });
});

// restaurants routes -----------------------------------------------

//view
router.get("/deleteR", (req,res)=> {
    Db.deleteR((err,data)=> {
        if(err) {
            res.send("cannon delete")
        }
        res.send("deleted")
    });
});

//delete
router.get("/viewR", (req,res)=> {
    Db.viewRestaurants((err,data)=> {
        res.json(data);
    })
});
router.get("/viewSession", (req,res)=> {
        res.json(req.session.searchData);

});

module.exports = router;