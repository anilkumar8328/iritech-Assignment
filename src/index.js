const express = require('express')
const multer = require('multer')
const routes = require('./routes/route')
const mongoose = require('mongoose')

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(multer().any())
app.use('/', routes)

mongoose.connect("mongodb+srv://salman-110:Salman110@cluster0.qfvxy.mongodb.net/Iritech_Assignment", { useNewUrlParser: true })
    .then(() => console.log('MongoDB is connected!!'))
    .catch(err => console.log(err))


app.listen(process.env.PORT || 3000, function () {
    console.log('Sever Connected at : ' + (process.env.PORT || 3000))
});