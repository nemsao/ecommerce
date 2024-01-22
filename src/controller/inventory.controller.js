'use strict'
const InventoryService =require('../service/inventory.service')
const {OK,CREATED,SuccessResponse}=require('../core/success.response')

class InventoryController{
      addStockToInventory =async (req,res,next)=>{
    //new 
    new SuccessResponse({
        message:'Create new cart Success ',
        metadata:await InventoryService.addStockToInventory(req.body)
    }).send(res)
   }
   
}

module.exports=new InventoryController()