'use strict'

const { randomBytes } = require("crypto")
const crypto = require('crypto')

const apikeyModel = require("../model/apikey.model")

const findById=async (key)=>{
    // const newkey=await apikeyModel.create({
    //     key:randomBytes(64).toString('hex'),
    //     permissions:['0000']
    // })
    // console.log(newkey)
    const objKey= await apikeyModel
    .findOne({key,status:true}).lean()
    return objKey
}

module.exports={
    findById
}