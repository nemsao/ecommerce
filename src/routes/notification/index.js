'use strict'
 const express=require('express')
 const router=express.Router()
const { asyncHandler}=require('../../helpers/asyncHandler')
const {authentication,authenticationV2}=require('../../auth/authUtils')
const Noti = require('../../controller/notification.controller')
//here not login
  

 ////AUTHENTICATION
 router.use(authenticationV2)
router.get('',asyncHandler(Noti.listNotiByUser))


module.exports=router