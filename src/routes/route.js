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
router.post('/userLogin',userlogin)

//admin Login
router.post('/adminLogin',adminlogin)

//Adim Create Food Items
router.post('/createItems', adminauthentication, createFoodItems)

//update food Items
router.post('/updateItems/:ItemId', adminauthentication, updateFoodItems)

//delete food Items
router.post('/deleteItems', adminauthentication, deleteFoodItems)

//public api to get all food items
router.get('/getAllItems',getAllTheFoodItems)

//user place order
router.post('/userPlaceOrder/:userId', userauthentication, userPlaceOrder)

//get user details by admin only
router.get('/getUserDetails', adminauthentication, getuserDetailsbyAdmin)

//get order details by admin only
router.get('/getOrderDetails', adminauthentication, getorderDetailsbyAdmin)


module.exports=router