'use strict'


const { SuccessResponse } = require('../core/success.response')
const {listNotiByUser}=require('../service/notification.service')

class NotiController{
    listNotiByUser=async(req,res,next)=>{
        new SuccessResponse({
            message:'create new list notification by user',
            metadata:await listNotiByUser(req.query)
        }).send(res)
    }
  

}

module.exports=new NotiController