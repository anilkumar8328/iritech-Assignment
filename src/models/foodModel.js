const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    Item: {
        type: String,
        required: true,
        trim: true
    },
    price :{
        type:Number,
        required :true,
        trim:true
    },
    quantity : {
        type:Number,
        required:true
    },
    delete : {
        type :Boolean,
        reuired:true
    }

}, { timestamps: true })

module.exports = mongoose.model('foodeItems', userSchema)