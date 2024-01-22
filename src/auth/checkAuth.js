'use strict'

const { findById } = require('../service/apikey.service')

const HEADER={
    API_KEY:'x-api-key',
    AUTHORIZATION:'authorization'
}
const apiKey= async (req,res,next)=>{
    try{
        const key=req.headers[HEADER.API_KEY]?.toString()
        if(!key){
             return res.status(403).json({
                message:'Forbidden Error'
             })
        }
        // check objkey
        const objKey=await findById(key)
        if(!objKey){
            return res.status(403).json({
                message:'Forbidden Error'
            })
        }

        req.objKey=objKey
        return next()
    }catch(err){
        next(err)
    }
}
const permission=(permission)=>{
    return (req,res,next)=>{
        if(!req.objKey.permissions){
            return res.status(403).json({
                message:'permission denied'
             })
        }
        console.log('permissions ::',req.objKey.permissions)
         const validPermission=req.objKey.permissions.includes(permission)
       if(!validPermission){
        return res.status(403).json({
            message:'permission denied'
         })
       }
       return next()
    }
}

module.exports={
    apiKey,permission
}