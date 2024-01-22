'use strict'

const shopModel = require("../model/shop.model")

const findByEmail=async ({email,select={
    email:1,password:2,name:1,status:1
}})=>{
    return await shopModel.findOne({email:email}).select(select).lean()
}
module.exports={
    findByEmail
}