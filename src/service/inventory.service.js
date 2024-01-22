'use strict'

const { BadRequestError } = require('../core/error.response')
const {
   inventory
}=require('../model/inventory.model')
const { getProductById } = require('../model/respositories/product.repo')

class InventoryService{
    static async addStockToInventory({stock,
    productId,
    shopId,
    location='134, Hai Duong,Tp'  }){

        const product=await getProductById(productId)
        if(!product) throw new BadRequestError('The product does not exists')
        const query={inven_shopId:shopId,inven_productId:productId},
           updateSet={
            $inc:{
                inven_stock:stock
            },
            $set:{
                inven_location:location
            }
            
           },options={upsert:true,new:true}
           return await inventory.findOneAndUpdate(query,updateSet,options)

    }
}

module.exports=InventoryService