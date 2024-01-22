'use strict'

const keytokenModel = require("../model/keytoken.model")
const {Types}=require('mongoose')
class KeyTokenService{
    //create  token
    static createKeyToken= async ({userId,publicKey,privateKey,refreshToken})=>{
           try{
           
            
            // level 0
            // const tokens=await keytokenModel.create({
            //     user:userId,
            //     publicKey,
            //     privateKey
            // })
            // console.log(tokens)
            // return tokens ? tokens.publicKey:null
           
           const filter={user:userId},update={publicKey,privateKey,refreshTokensUsed:[],refreshToken},
           options={upsert:true,new:true}
            const tokens= await keytokenModel.findOneAndUpdate(filter,update,options)
            
            
            return tokens?tokens.publicKey:null

           }catch(error){
            return {status:'err',
            error}
           }
    }
    static findByUserId=async (userId)=>{
        return await keytokenModel.findOne({user:new Types.ObjectId(userId)})
    }
    static removeKeyById=async (id)=>{
        return await keytokenModel.findOneAndRemove(id).lean()
    }
    static findByRefreshTokenUsed=async (refreshToken)=>{
      return await keytokenModel.findOne({refreshTokensUsed:refreshToken}).lean()
    }
    static findByRefreshToken=async (refreshToken)=>{
        return await keytokenModel.findOne({refreshToken})
      }
    static deleteKeyById=async (userId)=>{
        return await keytokenModel.deleteOne({user:userId})
      }
    
}
module.exports=KeyTokenService