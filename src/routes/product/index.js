'use strict'
 const express=require('express')
const productController = require('../../controller/product.controller')
 const router=express.Router()
const { asyncHandler}=require('../../helpers/asyncHandler')
const {authentication,authenticationV2}=require('../../auth/authUtils')


router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('',asyncHandler(productController.finAllProducts))
router.get('/:product_id',asyncHandler(productController.finProducts))
 ////AUTHENTICATION
 router.use(authenticationV2)
 /////
  router.post('',asyncHandler(productController.CreateProduct))
  router.patch('/:productId',asyncHandler(productController.updateProduct))


  router.post('/publish/:id',asyncHandler(productController.publishProductByShop))
  router.post('/unpublish/:id',asyncHandler(productController.unPublishProductByShop))
 

  
  router.get('/draft/all',asyncHandler(productController.getAllDraftForShop))

  router.get('/published/all',asyncHandler(productController.getAllPublishForShop))
 module.exports=router