'use strict'
 const express=require('express')
 const router=express.Router()
const { asyncHandler}=require('../../helpers/asyncHandler')
const {authentication,authenticationV2}=require('../../auth/authUtils')
const inventoryController = require('../../controller/inventory.controller')

// get amount a discount 
 router.use(authenticationV2)
router.post('/review',asyncHandler(inventoryController.addStockToInventory))

 ////AUTHENTICATION


module.exports=router