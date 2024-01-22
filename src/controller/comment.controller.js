'use strict'


const { SuccessResponse } = require('../core/success.response')
const CommentService=require('../service/comment.service')

class CommentController{
    createComment=async(req,res,next)=>{
        new SuccessResponse({
            message:'create new comment',
            metadata:await CommentService.createComment(req.body)
        }).send(res)
    }
    GetCommentParentById=async(req,res,next)=>{
        new SuccessResponse({
            message:'Get comment parent comment',
            metadata:await CommentService.getCommentByParentId(req.body)
        }).send(res)
    }
    deleteComments=async(req,res,next)=>{
        new SuccessResponse({
            message:'Successful Delete a comment and its childs',
            metadata:await CommentService.deleteComments(req.body)
        }).send(res)
    }

}

module.exports=new CommentController