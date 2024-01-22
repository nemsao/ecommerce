'use strict'
 const express=require('express')
 const router=express.Router()
const { asyncHandler}=require('../../helpers/asyncHandler')
const {authentication,authenticationV2}=require('../../auth/authUtils')
const cartController = require('../../controller/cart.controller')

// get amount a discount 
router.post('',asyncHandler(cartController.addToCart))
router.delete('',asyncHandler(cartController.delete))
router.post('/update',asyncHandler(cartController.update))
router.get('',asyncHandler(cartController.listToCart))


 ////AUTHENTICATION
 router.use(authenticationV2)

module.exports=router