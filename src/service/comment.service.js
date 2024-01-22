'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment=require('../model/comment.model')
const { findProduct } = require('../model/respositories/product.repo')
const { convertToObjectIdMongoDb } = require('../ultils')

/*
key feature:Comment service
+add comment [User,Shop]
+get a list of comment [User,Shop]
+delete a comment [User,Shop,Admin]
*/

class CommentService{
 static async createComment({productId,userId,parentCommentId=null,content}){
    const comment=new Comment({
        comment_productId:productId,
        comment_userId:userId,
        comment_content:content,
        comment_parentId:parentCommentId
    })

    let rightValue
    if(parentCommentId){
    //reply comment 
     const parentComment =await Comment.findById(parentCommentId)
     if(!parentComment) throw new NotFoundError('parent Comment not found')
     
     rightValue=parentComment.comment_right
     await Comment.updateMany({
        comment_productId:convertToObjectIdMongoDb(productId),
        comment_right:{$gte:rightValue} },{
            $inc:{comment_right:2}
        }
    )


      await Comment.updateMany({
        comment_productId:convertToObjectIdMongoDb(productId),
        comment_left:{$gt:rightValue} },{
            $inc:{comment_left:2}
        }
    )



    }else{
      const maxRightValue=await Comment.findOne({
        comment_productId:convertToObjectIdMongoDb(productId),

      },'comment_right',{sort:{comment_right:-1}} )

      if(maxRightValue) {
         rightValue=maxRightValue.comment_right+1
        console.log(' Right Value::',rightValue)
       
       

      }else{
        
        rightValue=1
        
      }
    }

  comment.comment_left=rightValue
  comment.comment_right=rightValue+1
  await comment.save()
  return comment
 }
 static async getCommentByParentId({
    productId,
    parentCommentId=null,
    limit=50,
    offset=0//skip
 }){
    if(parentCommentId){
        const parent=await Comment.findById(parentCommentId)
        if(!parent){
            throw new NotFoundError('Not found comment for product')
        }

        const comments=await Comment.find({
            comment_productId:convertToObjectIdMongoDb(productId),
            comment_left:{$gt:parent.comment_left},
            comment_right:{$lte:parent.comment_right}
        }).select({
            comment_left:1,
            comment_right:1,
            comment_content:1,
            comment_parentId:1,           
        }).sort({
            comment_left:1
        })

        return comments
    }
    const comments=await Comment.find({
        comment_productId:convertToObjectIdMongoDb(productId),
        comment_parentId:parentCommentId
    }).select({
        comment_left:1,
        comment_right:1,
        comment_content:1,
        comment_parentId:1,           
    }).sort({
        comment_left:1
    })

    return comments
 }
 static async deleteComments({commentId,productId}){
     //check the product 
     const foundProduct=await findProduct({
        product_id:productId
     })
     if(!foundProduct) throw new NotFoundError('product Not found')
     //xác định giá trị left vs right of commentId
     const comment=await Comment.findById(commentId)
     if(!comment) throw new NotFoundError('comment Not found')

     const leftValue =comment.comment_left
     const rightValue =comment.comment_right

     //2 tính witdh 
     const witdh = rightValue - leftValue+1
     //3 xoa tất cả commenId con 
     
     await Comment.deleteMany({
        comment_productId:convertToObjectIdMongoDb(productId),
        comment_left:{$gte:leftValue,$lte:rightValue}
     })
     //4.cap ngat gia tri lef và right

     await Comment.updateMany({
        comment_productId:convertToObjectIdMongoDb(productId),
        comment_right:{$gt:rightValue}
     },{
        $inc:{comment_right:-witdh}
     })


     await Comment.updateMany({
        comment_productId:convertToObjectIdMongoDb(productId),
        comment_left:{$gt:rightValue}
     },{
        $inc:{comment_left:-witdh}
     })

     return true
 }
}

module.exports=CommentService