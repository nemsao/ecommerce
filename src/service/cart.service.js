'use strict'

const { update } = require('lodash')
const {cart}=require('../model/cart.model')
const { getProductById,findProductInCart } = require('../model/respositories/product.repo')
const { NotFoundError } = require('../core/error.response')
/**
 *  Key features:Cart Service
 * -add product to cart[user]
 * -reduce product quantity by one [User]
 * -get cart[user]
 * -Delete cart[user]
 * -Delete cart item[user]
 * 
 */

class CartService{
    //START REPO CART
    static async createUserCart({userId,product}){
       
        const query ={cart_userId:userId,
                       cart_state:'active'},
                    updateOrInsert={
                        $addToSet:{
                            cart_products:product}
                        },options = {upsert:true,new:true}
                    

        return await cart.findOneAndUpdate(query,updateOrInsert,options)
    } 

    static async updateUserCartQuantity({userId,product}){
        const {productId,quantity}=product
        const query ={cart_userId:userId,
                      'cart_products.productId':productId,
                       cart_state:'active'},
                    updateSet={
                        $inc:{
                            'cart_products.$.quantity':quantity}
                        },options = {upsert:true,new:true}
                    

        return await cart.findOneAndUpdate(query,updateSet,options)
    }
    static async addNewProductToCart({userId,product}){
        
        const query ={cart_userId:userId,
                    cart_state:'active'},
             updateOrInsert={
             $addToSet:{
                 cart_products:product}
             },options = {upsert:true,new:true}
         

        return await cart.findOneAndUpdate(query,updateOrInsert,options)
    }


    static async addUserProductToCart({userId,product}){
        const {productId,quantity}=product
        const query ={  cart_userId:userId,
                      'cart_products.productId':productId,
                       cart_state:'active'},
                    updateSet={
                        $pull:{
                            cart_products:product,
                        }
                        },options = {upsert:true,new:true}
                    

        return await cart.findOneAndUpdate(query,updateSet,options)
    }
static async addToCart({userId,product={}}){
    
    //check cart tồn tại không
    const userCart=await cart.findOne({cart_userId:userId})
    if(!userCart){
        //create cart for User
        return await CartService.createUserCart({userId,product})
    }

    // neu co gio hang nhung chua co san pham 
    if(!userCart.cart_products.length){
        userCart.cart_products=[product]
        return await userCart.save()
    }

    if(findProductInCart(userCart,product) ){
        userCart.cart_products.push(product)
        console.log('carrt product ',userCart.cart_products )
        return await userCart.save()
    }


    //Neu hang ton tai ,va co san pham nay thi updat quantity 
    return await CartService.updateUserCartQuantity({userId,product})
}
    // update 
    /**
     * {
     * shopId,
     * item_products:{
     *   quantity,
     *   price,
     *   sopId,
     *   old_quantity,
     *   productId
     * },
     *   version
     *      
     * }
     */
    static async addToCartV2({userId,shop_order_ids}){
        console.log(shop_order_ids)
         const{productId,quantity,old_quantity}=shop_order_ids[0]?.item_products[0]
         const foundProduct=await getProductById(productId)
         if(!foundProduct) throw new NotFoundError('')

         //COMPARE
         if(foundProduct.product_shop.toString()!== shop_order_ids[0]?.shopId){
            throw new NotFoundError('Product do not belong to the shop')
         }

         if(quantity===0){
            //deleted

         }

         return await CartService.updateUserCartQuantity({
            userId,
            product:{
                productId,
                quantity:quantity-old_quantity
            }
         })
    }


    static async deleteUserCart({userId,productId}){
        const query={cart_userId:userId,cart_state:'active'},
        updateSet={
            $pull:{
                cart_products : {
                    productId
                }
            }
        }
        const deleteCart=await cart.updateOne(query,updateSet)

        return deleteCart
    }
    static async getListUserCart({userId}){
         return await cart.findOne({
            cart_userId:+userId
         }).lean()
    }
    
}


module.exports = CartService