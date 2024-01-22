const{convertToObjectIdMongoDb}=require('../../ultils')
const {cart}=require('../cart.model')

const findCartById=async ({cartId})=>{
    return await cart.findOne({_id:convertToObjectIdMongoDb(cartId)})
}

const checkProductByServer=async (products)=>{
    return await Promise.all(products.map(async product=>{
        const foundProduct=await getProductById(product.productId)
        if(foundProduct){
            return {
                price:foundProduct.product_price,
                quantity: product.quantity,
                productId:product.productId
            }
        }
    }))
}
module.exports={
    findCartById,
    checkProductByServer

}