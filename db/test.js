let Db = require("./db.js");

let Restaurants = Db.restaurants;
let Users = Db.users

let getDate = new Date();


function createRestaurant(_name) {
    let newRestaurant = new Restaurants({
        name: _name,
        photo: "#",
        going: true,
        date: getDate.toLocaleString()
    });
    newRestaurant.save((err, data) => {
        if (err) {
            console.log(err);
        }
    });
}


function viewRestaurants(_name) {
    Restaurants.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log("info iz dbquery", data);
    })
}


let exportObject = {
    createRestaurant: createRestaurant,
    viewRestaurants: viewRestaurants
};

module.exports = exportObject;