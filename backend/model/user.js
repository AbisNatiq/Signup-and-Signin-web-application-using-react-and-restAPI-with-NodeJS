const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    fname:{
        type:String,
        required: true,
        min:4,
        max:50
    },
    lname:{
        type:String,
        required: true,
        min:4,
        max:50
    },
    email:{
        type:String,
        required: true,
        min:4,
        max:50
    },
    pass:{
        type:String,
        required: true,
        min:4,
        max:50
    }
});


module.exports = mongoose.model('user',userSchema);