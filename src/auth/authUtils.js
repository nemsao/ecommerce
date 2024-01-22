'use strict'
const HEADERS={
    API_KEY:'x-api-key',
    CLIENT_ID:'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'x-rtoken-id'
}

const JWT= require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError ,NotFoundError} = require('../core/error.response')
const { findByUserId } = require('../service/keyToken.service')
const { referrerPolicy } = require('helmet')


const createTokenPair=async (payload ,publicKey,privateKey)=>{
   console.log(publicKey,privateKey)
   try{
    //access topken
    const accessToken =await JWT.sign(payload,publicKey,{
        
        expiresIn:'2 days'
    })

    const refreshToken =await JWT.sign(payload,privateKey,{
        
        expiresIn:'7 days'
    })


    JWT.verify(accessToken,publicKey,(err,decode)=>{
          if(err){console.log('error verify ::',err)}
            else console.log('decode verify ::' ,decode)
    })
    
     


    return {accessToken,refreshToken}

   
   }
   catch(error){

   }
}
const authentication = asyncHandler(async (req,res,next )=>{
    /* 
      1- Check userId missing?
      2- Get acccess token
      3- Verify token 
      4- check user in bds
      5- check KeyStore with this userId
      6- OK all => return next()
    */
   //1
   const userId=req.headers[HEADERS.CLIENT_ID]
   if(!userId) throw new AuthFailureError('Invalid Request')
   
   const keyStore=await findByUserId(userId)
   if(!keyStore) throw new NotFoundError('NOT FOUND KEYSTORE')
   //2
   const accessToken=req.headers[HEADERS.AUTHORIZATION]
   if(!accessToken) throw new AuthFailureError('Invalid Request')
    //3
   try{
    const decodeUser =JWT.verify(accessToken,keyStore.publicKey)
    if(userId !== decodeUser.userId){
      throw new AuthFailureError('Invalid UserId')
    }
    req.keyStore=keyStore
    return next()

   }catch(err){
     throw err
   }

})



const authenticationV2 = asyncHandler(async (req,res,next )=>{
  /* 
    1- Check userId missing?
    2- Get acccess token
    3- Verify token 
    4- check user in bds
    5- check KeyStore with this userId
    6- OK all => return next()
  */
 //1
 const userId=req.headers[HEADERS.CLIENT_ID]
 if(!userId) throw new AuthFailureError('Invalid Request')
 //2
 const keyStore=await findByUserId(userId)
 if(!keyStore) throw new NotFoundError('NOT FOUND KEYSTORE')
 
 if(req.headers[HEADERS.REFRESHTOKEN]){
  try{
    const refreshToken=req.headers[HEADERS.REFRESHTOKEN]
    const decodeUser =JWT.verify(refreshToken,keyStore.privateKey)
  if(userId !== decodeUser.userId){
    throw new AuthFailureError('Invalid UserId')
  }

  req.keyStore=keyStore
  req.user=decodeUser
  
  req.refreshToken=refreshToken
  
  return next()
  }catch(err){
    throw err
  }
 }
 const accessToken=req.headers[HEADERS.AUTHORIZATION]
 if(!accessToken) throw new AuthFailureError('Invalid Request')
  //3
 try{
  const decodeUser =JWT.verify(accessToken,keyStore.publicKey)
  if(userId !== decodeUser.userId){
    throw new AuthFailureError('Invalid UserId')
  }
  req.keyStore=keyStore
  return next()

 }catch(err){
   throw err
 }



 
})
const verifyJWT =async (token,keySecret)=>{
     return await JWT.verify(token,keySecret)
}
module.exports={
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}