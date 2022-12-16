const express=require('express')
const router=express.Router()

const {userSignup,adminSignup,userlogin,adminlogin,createFoodItems,updateFoodItems,deleteFoodItems,getAllTheFoodItems,userPlaceOrder,getuserDetailsbyAdmin,getorderDetailsbyAdmin}=
    require('../controller/Controller')

const {userauthentication,adminauthentication}=require('../middlewares/auth')
//user Sign up
router.post('/userSignUp',userSignup)

//admin Sign Up
router.post('/adminSignUp',adminSignup)

//user Login
router.get('/userLogin',userlogin)

//admin Login
router.get('/adminLogin',adminlogin)

//Adim Create Food Items
router.get('/createItems', adminauthentication, createFoodItems)

//update food Items
router.get('/updateItems?:ItemId', adminauthentication, updateFoodItems)

//delete food Items
router.get('/deleteItems', adminauthentication, deleteFoodItems)

//public api to get all food items
router.get('/getAllItems',getAllTheFoodItems)

//user place order
router.get('/userPlaceOrder/:userId', userauthentication, userPlaceOrder)

//get user details by admin only
router.get('/getUserDetails', adminauthentication, getuserDetailsbyAdmin)

//get order details by admin only
router.get('/getOrderDetails', adminauthentication, getorderDetailsbyAdmin)


module.exports=router