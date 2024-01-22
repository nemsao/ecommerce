const redisPubSubService = require('../service/redisPubSub.service')


class ProductServieTest{
    purchaseProduct(productId,quantity){
        const order={
            productId,
            quantity
        }
        redisPubSubService.publish('purcahse_event',JSON.stringify(order))
    }
}

module.exports=new ProductServieTest()