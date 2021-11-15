  
const mongoose = require('mongoose');

const User = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    userName : String,
    password : String,
    starredRepos : Array
});

module.exports =  mongoose.model('User', User);