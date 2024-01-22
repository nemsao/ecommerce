'use strict'
 const express=require('express')
 const router=express.Router()
const { asyncHandler}=require('../../helpers/asyncHandler')
const {authentication,authenticationV2}=require('../../auth/authUtils')
const CheckoutController = require('../../controller/checkoutController')

// get amount a discount 
router.post('/review',asyncHandler(CheckoutController.CheckoutReview))

 ////AUTHENTICATION
 router.use(authenticationV2)

module.exports=router