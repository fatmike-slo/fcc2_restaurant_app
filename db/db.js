const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let url = process.env.DBURL;
mongoose.connect(url, {useMongoClient:true});


let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log('connected');
});


let restaurantsSchema = new mongoose.Schema({
    name: String,
    count: Number,
    whoIsGoing: [{type: String}]
});

let userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    date: String
});




// -------------- query functions -----------------

let RestaurantsModel = module.exports = mongoose.model("restaurants", restaurantsSchema);
let UserModel = module.exports =  mongoose.model("users", userSchema);


// user queries ------------------------------------
// if username exists
module.exports.ifUserExist = (username, callback)=> {
    UserModel.findOne({username:username}, callback);
};
// validate user 
module.exports.validateUser = (username, password, callback)=> {
    UserModel.findOne({
        username:username,
        password:password
    }, callback);
};
// create user
module.exports.createUsers = (username, email, password, date, callback)=> {
    let newUser = new UserModel({
        username:username,
        email:email,
        password:password,
        date:date
    });
    newUser.save(callback);
}
// view users
module.exports.viewUsers = (callback)=> {
    // zgradimo callback, tako da izvedemo ukaz kaj hocemo z dbjem, in callback ki ga poklicemo
    // ko ga rabimo...ultra
    UserModel.find({}, callback);
};
// delete ALL users
// view users
module.exports.deleteAllUsers = (callback)=> {
    // zgradimo callback, tako da izvedemo ukaz kaj hocemo z dbjem, in callback ki ga poklicemo
    // ko ga rabimo...ultra
    UserModel.remove({}, callback);
};


// restaurants queries ------------------------------
// create
module.exports.createRestaurant = (name, username, count, callback)=> {
   // todo: implementiraj se userja ki gre !
    let newRestaurant = new RestaurantsModel({
        name: name,
        count: count,
        whoIsGoing:username
    });
    // ista pasta, samo callback mora biti da shranimo. Lego kocke
    newRestaurant.save(callback);
}

// view restaurants
module.exports.viewRestaurants = (callback)=> {
    // zgradimo callback, tako da izvedemo ukaz kaj hocemo z dbjem, in callback ki ga poklicemo
    // ko ga rabimo...ultra
    RestaurantsModel.find({}, callback);
};

// view if restaurant already exist
module.exports.isRestaurant = (name, callback)=> {
    // zgradimo callback, tako da izvedemo ukaz kaj hocemo z dbjem, in callback ki ga poklicemo
    // ko ga rabimo...ultra
    RestaurantsModel.findOne({name:name}, callback);
};
// update restaurant count and username going
module.exports.updateRestaurant = (name, username,callback)=> {
    // zgradimo callback, tako da izvedemo ukaz kaj hocemo z dbjem, in callback ki ga poklicemo
    // ko ga rabimo...ultra
    RestaurantsModel.findOneAndUpdate({name:name}, {
        $inc : {count: 1},
        $addToSet: {whoIsGoing:username}},
        {new: true}
    ).exec(callback);
};


// delete restaurants data
module.exports.deleteR = (callback)=> {
    // zgradimo callback, tako da izvedemo ukaz kaj hocemo z dbjem, in callback ki ga poklicemo
    // ko ga rabimo...ultra
    RestaurantsModel.remove({}, callback);
};

