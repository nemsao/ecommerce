const redisPubSubService=require('../service/redisPubSub.service')

class InvenToryService{
    constructor(){
    redisPubSubService.subscribe('purchase_event',(channel,message)=>{
    InvenToryService.updateInventory(message)
    })

    
}

static updateInventory(productId,quantity){
        console.log(`Update inventory :: ${productId}with ${quantity}`)
    }
}

module.exports=new InvenToryService()