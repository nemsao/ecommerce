'use strict'

const shopModel = require("../model/shop.model")
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const keyTokenService =require('./keyToken.service')
const { createTokenPair,verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../ultils")
const { BadRequestError ,AuthFailureError,ForbiddenError} = require("../core/error.response")
    const {findByEmail}=require('./shop.service')
const KeyTokenService = require("./keyToken.service")
const { create } = require("lodash")


const RoleShop={
    SHOP:'SHOP',
    WRITER:'WRITER',
    EDITER:'EDITOR',
    ADMIN:'ADMIN'
}

class AccessService{


  static handleRefreshToken=async ({refreshToken , user , keyStore})=>{
    /*
    Check Token
     */
    // decode to check for Authenticated User
     const{userId , email } = user
    if(keyStore.refreshTokensUsed.includes(refreshToken)){
       // Delele all token from this userID  in Key Store
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happen !!! Please relogin')
    }
    if(keyStore.refreshToken!== refreshToken)throw new AuthFailureError('Shop not registered')

    const foundshop=await findByEmail({email})
    if(!foundshop){
      throw new AuthFailureError('Shop not registered')
    }
    // create 1 new pair token
    const tokens =await createTokenPair({userId,email},keyStore.publicKey,keyStore.privateKey)
    
    //update tokens
    await keyStore.updateOne({
              $set:{
                refreshToken:tokens.refreshToken
              },
              $push: {
                refreshTokensUsed: refreshToken
              }
    })
    return{
      user,
      tokens
    }



  }





   //LOG OUT
   static logout=async (keyStore)=>{
       const delKey = await keyTokenService.removeKeyById(keyStore._id)
       console.log({delKey})
       return delKey
   } 



  //  Log in Service
  //  1- Check Email in dbs
  //  2- match password
  //  3- Create AcessessToken and 
  //  4-  Generate Tokens

  

  // 1
   static login=async ({email,password,refreshToken=null})=>{
    
    const foundshop=await findByEmail({email})
    if(!foundshop) throw new BadRequestError('Shop not registered')
  // 2        
    const match=bcrypt.compare(password,foundshop.password)
    if(!match) throw new AuthFailureError('Auhentication Error')



     // 3
     const privateKey=crypto.randomBytes(64).toString('hex')

     const publicKey=crypto.randomBytes(64).toString('hex')
     
      
     // 4
     const tokens=await createTokenPair({userId:foundshop._id,email},publicKey,privateKey)
     

     await  keyTokenService.createKeyToken({
      userId:foundshop._id,
      refreshToken:tokens.refreshToken,
      publicKey,
      privateKey
})
return {
  
      shop:getInfoData({fileds:['_id','name','email'],object:foundshop}),
      tokens
  
}

   }
   //Sign up a Shop
   static signup=  async ({name,email,password})=>{
       
        
             //check email
             
             const hodelShop=await shopModel.findOne({email}).lean()
             if(hodelShop){
              
               throw new BadRequestError('Error Shop already registered')
             }
             
              const passwordHash=await bcrypt.hash(password,10)
              const newShop= await shopModel.create({
                name,email, password:passwordHash,roles:[RoleShop.SHOP]
              })

              if(newShop){
                // created privateKey ,publicKey lv0
                // const {privateKey,publicKey}=crypto.generateKeyPairSync('rsa',{
                //   modulusLength: 4096,
                //   // publicKey Crypto graphy Standards type:1
                //   publicKeyEncoding:{
                //     type:'pkcs1',
                //     format:'pem'
                //   },
                //   privateKeyEncoding:{
                //     type:'pkcs1',
                //     format:'pem'
                //   }
                  
                // })
                     // created privateKey ,publicKey lv0
                     const privateKey=crypto.randomBytes(64).toString('hex')

                      const publicKey=crypto.randomBytes(64).toString('hex')
               //save collection keyStore
              const keyStore =await  keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
              })
              
              if(!keyStore){
                
                  throw new BadRequestError('Key Store Error')
                
              }
              

              //create token pair
              const tokens=await createTokenPair({userId:newShop._id,email},publicKey,privateKey)
              
              return {
                code :201,
                metadata:{
                    shop:getInfoData({fileds:['_id','name','email'],object:newShop}),
                    tokens
                }
              }
              }
             return{
                code :200,
                metadata:null
            }
       
   }
}

module.exports=  AccessService