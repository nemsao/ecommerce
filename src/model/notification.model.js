'use strict'

const {model,Schema}= require('mongoose')
const DOCUMENT_NAME='Notification'
const COLLECTION_NAME='Notifications'
  //order successfuly
  //order fail
  //new promotion
  //new product by User following


const notificationSchema=new Schema({
    noti_type:{type:String,enum:['ORDER-001','ORDER-002','PROMOTION-001','SHOP-001']},
    noti_senderId:{type:Schema.Types.ObjectId,ref:'Shop'},
    noti_receivedId:{type:Number,require:true},
    noti_content:{type:String,require:true},
    noti_options:{type:Object,default:{}}
},{
    timestamps:true,
    collection:COLLECTION_NAME
}
    
)

module.exports={NOTI:model(DOCUMENT_NAME,notificationSchema)}