
const { convertToObjectIdMongoDb } = require('../../ultils')
const {inventory}=require('../inventory.model')
const{Types}=require('mongoose')


const insertInventory = async({ shopId,productId,stock,location='unknow'})=>{
 return await inventory.create({
    inven_shopId:shopId,
    inven_productId:productId,
    inven_stock:stock,
    inven_reservations:location,

 })
}

const reservationInventory=async({productId,quantity,cartId})=>{
   const query={
      inven_productId:convertToObjectIdMongoDb(productId),
      inven_stock:{$gte:quantity}
   },updateSet={
      $inc:{
      inven_stock: -quantity},
      $push:{
        inven_reservations:{
         quantity,
         cartId,
         createOn:new Date()
        }
      }
   },options={upsert:true,new : true}

   return await inventory.updateOne(query,updateSet)
}
module.exports={insertInventory,
                reservationInventory}