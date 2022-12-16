const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/UserModel')
const userProfileModel = require('../models/UserProfileModel')
const adminModel = require('../models/adminModel')
const foodModel = require('../models/foodModel')
const orderModel = require('../models/userOrderFoodModel.js')
const validator=require('../util/validations')
const {uploadFile}= require('../util/aws_sdk')


//User Sign Up

const userSignup = async function (req, res) {
    try {

        let userDetails = req.body
        let { name, email,age, password } = userDetails

        if (!validator.isValidRequestBody(userDetails)) {
            return res.status(400).send({ status: false, message: "please provide valid user Details" })
        }

        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "user name is required" })
        }

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email-ID is required" })
        }

        if (!validator.isValid(age)) {
            return res.status(400).send({ status: false, message: "Age is required" })
        }

        if (!validator.isValidEmail(userDetails.email))
            return res.status(400).send({ status: false, message: "Invalid Email id." })

        const checkEmailFromDb = await userModel.findOne({ email })

        if (checkEmailFromDb) {
            return res.status(400).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        userDetails.password = hashedPassword

        const saveUserInDb = await userModel.create(userDetails);
        await userProfileModel.create({ user: saveUserInDb._id })

        return res.status(201).send({ status: true, message: "User Profile Created successfully!!", data: saveUserInDb });

    } catch (err) {

        return res.status(500).send({ status: false, error: err.message })

    }

}

//Admin Sign Up

const adminSignup = async function (req, res) {
    try {

        let adminDetails = req.body
        let { name, email, password } = adminDetails

        if (!validator.isValidRequestBody(adminDetails)) {
            return res.status(400).send({ status: false, message: "please provide valid user Details" })
        }

        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "user name is required" })
        }

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email-ID is required" })
        }

        if (!validator.isValidEmail(adminDetails.email))
            return res.status(400).send({ status: false, message: "Invalid Email id." })

        const checkEmailFromDb = await adminModel.findOne({ email })

        if (checkEmailFromDb) {
            return res.status(400).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        adminDetails.password = hashedPassword

        const saveUserInDb = await adminModel.create(adminDetails);

        return res.status(201).send({ status: true, message: "Admin Profile successfully!!", data: saveUserInDb });

    } catch (err) {

        return res.status(500).send({ status: false, error: err.message })

    }

}



//User Login
const userlogin = async function (req, res) {

    try {

        const loginDetails = req.body;

        const { email, password } = loginDetails;

        if (!validator.isValidRequestBody(loginDetails)) {
            return res.status(400).send({ status: false, message: 'Please provide login details' })
        }
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: 'Email-Id is required' })
        }
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: 'Password is required' })
        }
        const userData = await userModel.findOne({ email });

        if (!userData) {
            return res.status(401).send({ status: false, message: `Login failed!! Email-Id is incorrect!` });
        }

        const checkPassword = await bcrypt.compare(password, userData.password)

        if (!checkPassword) return res.status(401).send({ status: false, message: `Login failed!! password is incorrect.` });
        let userId=userData._id
        const token = jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }, "IRITECH-USER-JWT")

        return res.status(200).send({ status: true, message: "User LogIn Successful!!", data: {userId:userId,Token:token} });

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}


// Admin Login

const adminlogin = async function (req, res) {

    try {

        const loginDetails = req.body;

        const { email, password } = loginDetails;

        if (!validator.isValidRequestBody(loginDetails)) {
            return res.status(400).send({ status: false, message: 'Please provide login details' })
        }
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: 'Email-Id is required' })
        }
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: 'Password is required' })
        }
        const adminData = await adminModel.findOne({ email });
        console.log(adminData);
        console.log(password);

        if (!adminData) {
            return res.status(401).send({ status: false, message: `Login failed!! Email-Id is incorrect!` });
        }

        const checkPassword = await bcrypt.compare(password, adminData.password)

        if (!checkPassword) return res.status(401).send({ status: false, message: `Login failed!! password is incorrect.` });
        let adminId=adminData._id
        const token = jwt.sign({
            adminId: adminId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }, "IRITECH-ADMIN-JWT")

        return res.status(200).send({ status: true, message: "Admin LogIn Successful!!", data: {AdminId:adminId,Token:token} });

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}

//Create Food Items

const createFoodItems = async function (req, res) {

    try {
        let files = req.files
        const foodDetails = req.body;
        let adminIdFromToken = req.adminId
        console.log(adminIdFromToken);
        const findAdminData = await adminModel.findById(adminIdFromToken)
        if (!findAdminData) {
            return res.status(404).send({ status: false, message: "admin not found" })
        }
        if (findAdminData._id.toString() != adminIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }

        const { Item, price } = foodDetails;

        if (!validator.isValidRequestBody(foodDetails)) {
            return res.status(400).send({ status: false, message: 'Please provide Item details' })
        }
        if (!validator.isValid(Item)) {
            return res.status(400).send({ status: false, message: 'Item is required' })
        }
        if (!validator.isValid(price)) {
            return res.status(400).send({ status: false, message: 'price is required' })
        }

        if (!files.length) {
            return res.status(400).send({ status: false, message: "Item Image is required" })
        }
        const foodData = await foodModel.findOne({ Item : Item, delete : false });

        if (foodData) {
            return res.status(401).send({ status: false, message: `Item Is Present In The List Already` });
        }
        
        let ItemImage = await uploadFile(files[0]);

        foodDetails.delete=false
        foodDetails.ItemImage = ItemImage

        const saveUserInDb = await foodModel.create(foodDetails);

        return res.status(200).send({ status: true, message: "Item Created!!",data:saveUserInDb});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}


//Update Food Item


const updateFoodItems = async function (req, res) {

    try {
        let files = req.files
        const foodDetails = req.body;
        const ItemId = req.params.ItemId
        let adminIdFromToken = req.adminId

        const findAdminData = await userModel.findById(adminIdFromToken)
        if (!findAdminData) {
            return res.status(404).send({ status: false, message: "admin not found" })
        }
        if (findAdminData._id.toString() != adminIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }

        const { price, quantity } = foodDetails;

        if (!validator.isValidRequestBody(foodDetails)) {
            return res.status(400).send({ status: false, message: 'Please provide Item details' })
        }

        const foodData = await foodModel.findOne({ _id:ItemId });

        if (!foodData) {
            return res.status(401).send({ status: false, message: `No Item Exist` });
        }
        let updatePrice
        if(!price || price.length==0) updatePrice = fooDate.price
        else updatePrice=price

        let updatedImage
        if (files&&files.length) updatedImage = await uploadFile(files[0])
        else updatedImage = foodData.ItemImage

        let updateFoodDetails = {
            price : updatePrice,
            ItemImage:updatedImage,
            delete:false
        }

        let updateItems = await foodModel.findOneAndUpdate({_id :ItemId},updateFoodDetails,{new : true})

        return res.status(200).send({ status: true, message: "Item updated!!",data:updateItems});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}

//Delete food Item

const deleteFoodItems = async function (req, res) {

    try {

        let foodDetails = req.body
        let adminIdFromToken = req.adminId

        const findAdminData = await adminModel.findById(adminIdFromToken)
        if (!findAdminData) {
            return res.status(404).send({ status: false, message: "admin not found" })
        }
        if (findAdminData._id.toString() != adminIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }

        const { Item } = foodDetails;

        if (!validator.isValidRequestBody(foodDetails)) {
            return res.status(400).send({ status: false, message: 'Please provide Item details' })
        }
        if (!validator.isValid(Item)) {
            return res.status(400).send({ status: false, message: 'Item is required' })
        }

        const foodData = await foodModel.findOne({ Item : Item, delete : false });

        if (!foodData) {
            return res.status(401).send({ status: false, message: `Item Is eithr not Present Or Deleted Already` });
        }
        

        let updateItems = await foodModel.findOneAndUpdate({ Item : Item},{deleted : true},{new : true})


        return res.status(200).send({ status: true, message: "Item Deleted Sucessfully!!"});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}


//get All The Food Items

const getAllTheFoodItems = async function (req, res) {

    try {

        let foodData = await foodModel.find()

        if (!foodData || foodData.length === 0) {
            return res.status(401).send({ status: false, message: `No Item Is Present` });
        }

        return res.status(200).send({ status: true, data : foodData});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}

const userPlaceOrder = async function (req, res) {

    try {

        let userId = req.params.userId
        let foodData = req.body.order
        
        console.log(foodData);

        if (!foodData || foodData.length === 0) {
            return res.status(401).send({ status: false, message: `There No Item to Place the order` });
        }
        let findUser = await userModel.findById(userId)
        if (!findUser) {
            return res.status(404).send({ status: false, message: "admin not found" })
        }
        let totalprice 
        for(let i = 0;i < foodData.length;i++){
            let item = await foodModel.findOne({Item : foodData[i].Item})
            if(!item || item.length==0) return res.status(401).send({ status: false, message: `${foodData[i].Item} doesn't exist`});
            totalprice = foodData[i].quantity * foodData[i].price
        }

        let user = {
            user : userId,
            Orders : foodData,
            totalprice : totalprice
        }

        let data = await orderModel.create(user)
        return res.status(200).send({ status: true, message : "Order Placed Sucessfully",data : user});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}


const getuserDetailsbyAdmin = async function (req, res) {

    try {

        let adminIdFromToken = req.adminId
        const findAdminData = await adminModel.findById(adminIdFromToken)
        if (!findAdminData) {
            return res.status(404).send({ status: false, message: "admin not found" })
        }
        if (findAdminData._id.toString() != adminIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }
        let Data = await userModel.find().populate()

        if (!Data || Data.length === 0) {
            return res.status(401).send({ status: false, message: `No Item Is Present` });
        }

        return res.status(200).send({ status: true, data : Data});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}

const getorderDetailsbyAdmin = async function (req, res) {

    try {

        let adminIdFromToken = req.adminId
        const findAdminData = await adminModel.findById(adminIdFromToken)
        if (!findAdminData) {
            return res.status(404).send({ status: false, message: "admin not found" })
        }
        if (findAdminData._id.toString() != adminIdFromToken) {
            return res.status(403).send({ status: false, message: "You Are Not Authorized!!" })
        }
        let Data = await orderModel.find()

        if (!Data || Data.length === 0) {
            return res.status(401).send({ status: false, message: `No Item Is Present` });
        }

        return res.status(200).send({ status: true, data : Data});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}

module.exports={userSignup,adminSignup,userlogin,adminlogin,createFoodItems,updateFoodItems,deleteFoodItems,getAllTheFoodItems,userPlaceOrder,getuserDetailsbyAdmin,getorderDetailsbyAdmin}