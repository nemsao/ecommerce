'use strict'
 const express=require('express')
 const router=express.Router()
const { asyncHandler}=require('../../helpers/asyncHandler')
const {authentication,authenticationV2}=require('../../auth/authUtils')
const discountController = require('../../controller/discount.controller')

// get amount a discount 
router.post('/amount',asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code',asyncHandler(discountController.getAllDiscountWithProducts))
router.get('/:shopId',asyncHandler(discountController.getAllDiscountCodesByShop))


 ////AUTHENTICATION
 router.use(authenticationV2)
 router.post('',asyncHandler(discountController.createDiscountCode))
router.get('/',asyncHandler(discountController.getAllDiscountCode))

module.exports=router