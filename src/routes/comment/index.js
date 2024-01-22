'use strict'
 const express=require('express')
 const router=express.Router()
const { asyncHandler}=require('../../helpers/asyncHandler')
const {authentication,authenticationV2}=require('../../auth/authUtils')
const CommentController = require('../../controller/comment.controller')


 ////AUTHENTICATION
 router.use(authenticationV2)
router.post('',asyncHandler(CommentController.createComment))
router.delete('',asyncHandler(CommentController.deleteComments))
router.get('',asyncHandler(CommentController.GetCommentParentById))

module.exports=router