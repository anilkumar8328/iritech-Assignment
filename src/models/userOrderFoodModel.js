const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
      },
    Orders :{
        type : Array
    },
    totalPrice : {
        type : Number,
        default:0
    }

}, { timestamps: true })

module.exports = mongoose.model('orderFood', orderSchema)