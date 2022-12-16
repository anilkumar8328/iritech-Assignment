const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        trim: true
    },
    Item :{
        type:String,
        required :true,
        trim:true
    },

}, { timestamps: true })

module.exports = mongoose.model('orderFood', userSchema)