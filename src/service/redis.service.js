'use strict'
const {promisify}=require('util')
const redis=require('redis')
const { reservationInventory } = require('../model/respositories/inventory.repo')
const redisClient=redis.createClient()

const pexpire=promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync=promisify(redisClient.setEx).bind(redisClient)

const acquireLock=async(productId,quantity,cartId)=>{
    const key=`lock_v2023_${productId}`
    const retryTimes=10
    const expireTime=3000 // 3 seconds time lock

    for(let i=0;i<retryTimes ;i++){
        //Tao 1 key ai co key thi duoc thanh toan
        const result =await setnxAsync(key,expireTime)
        console.log("result ::", result)
        if(result===1){
             //thao tac vói inventory
             const isResrvation=await reservationInventory({
                productId,quantity,cartId
             })
             if(isResrvation.modifiedCount){
                await pexpire(key,expireTime)
                return key
             }
             return null
        }else{
            await new Promise((resolve)=> setTimeout(resolve,50))
        }
    }
}

const releaseLock =async keyLock=>{
    const delAsyncKey =promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports={
    acquireLock,
    releaseLock
}