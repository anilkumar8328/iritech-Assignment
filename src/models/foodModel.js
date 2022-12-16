const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({

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
    delete : {
        type :Boolean,
        reuired:true
    }

}, { timestamps: true })

module.exports = mongoose.model('foodItems', foodSchema)