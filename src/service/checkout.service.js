'use strict'


const { NotFoundError,BadRequestError } = require('../core/error.response')
const { checkProductByServer } = require("../model/respositories/product.repo")
const {getDiscountAmount}=require('./discount.service')
const {findCartById}=require('../model/respositories/checkout.repo')
const { acquireLock, releaseLock } = require('./redis.service')
const {order}=require('../model/order.model')
class CheckoutService{
         /**   login withput login
         * {
         * cartId,
         * userId,
         * shop_order_ids:[{
         *   shopId,
         *   shop_discount:[],
         *   item_products:[
         *    {
         *       price,
         *       quantity,
         *       productId
         *     }]
         * },
         *    {
         *       shopId,
         *       shop_discount:[
         *              { "shopId",
         *               "discountId",
         *               "codeId", }

         *             ],
                 item_products:[
                   {

                    price,
                    quantity,
                    productId
                   }

                 ]
         * }
         * 
         *  }]
         * }
         */
 static async checkoutReview({cartId,userId,shop_order_ids})
{ 
    const foundCart=await findCartById({cartId})
   if(!foundCart) throw new BadRequestError('Cart does not exitst')

   const checkout_order={
     totalPrice:0, //tong tien hang
     freeShip:0, // phi van chuyen
     totalDiscount :0, //tong tien discount giam dan
     totalcheckout:0 //tong thanh toan
   },shop_order_ids_new=[]

   //tinh tong tien bill

   for(let i=0;i<shop_order_ids.length ;i++){
    const{shopId,shop_discounts=[],item_products=[]}=shop_order_ids[i]

    //check product available
    const checkProductServer=await checkProductByServer(item_products)
    console.log('checkProductService :: ' , checkProductServer)
    if(!checkProductServer[0]){
         throw new BadRequestError('order wrong !!!')
        }

    //tong tien don hang 
         const checkoutPrice = checkProductServer.reduce((acc,product)=>{
          return acc+(product.quantity*product.price)
         },0)

         console.log("checkoutPrice ::" ,checkoutPrice)
    // tong tien truoc khi xu ly
    checkout_order.totalPrice+=checkoutPrice

    const itemCheckout={
      shopId,
      shop_discounts,
      priceRaw :checkoutPrice,//truoc khi giam gia
      priceApplyDiscount:checkoutPrice,
      item_products:checkProductServer
    }
    // Neu shop discount co ton tai ,check xem co hpo le không  
    if(shop_discounts.length>0){
     // giả su chi co mot discount
     //get amount discount
     const{totalPrice=0,discount=0}= await getDiscountAmount({
     
      codeId:shop_discounts[0].codeId,
      userId,
      shopId,
      products:checkProductServer
     })
     console.log("Discount :::",discount)
     // tong cong discount giam gia
     checkout_order.totalDiscount+=discount

     console.log("tổng tien giam gia  checkout_order.totalDiscount+=discount",checkout_order.totalDiscount)
     //new tien giam gia lon hon 0
     if(discount>0){
      itemCheckout.priceApplyDiscount =checkoutPrice-discount
     }
    }
    console.log("tổng tien giam gia  itemCheckout.priceApplyDiscount =checkoutPrice-discount",
    itemCheckout.priceApplyDiscount)

    // tong thanh toan cuoi cung 
    checkout_order.totalcheckout+= itemCheckout.priceApplyDiscount
    shop_order_ids_new.push(itemCheckout)
   }
   return {
    shop_order_ids,
    shop_order_ids_new,
    checkout_order
   }
 }

 static async orderByUser({
  shop_order_ids,
  cartId,
  userId,
  user_address={},
  user_payment={}
 }){
   const{shop_order_ids_new,checkout_order}=await CheckoutService.checkoutReview({
    cartId,
    userId,
    shop_order_ids
   })
   //check lại mot lan nữa xem kho con trong  kho hay khong?
   // get new array Products
   const products=shop_order_ids_new.flatMap(order=>order.item_products) 
   console.log('[1] ::',products)
   const accquireProduct=[]
   for(let i=0;i<products.length;i++){
    const {productId,quantity}=products[i]
    const keyLock =await acquireLock(productId,quantity,cartId)
    acquireLock.push(keyLock?true:false)
    if(keyLock){
      await releaseLock(keyLock)
    }
   }
   //check neu  có 1 sp hết hàng trong kho 
   if(accquireProduct.includes(false)){
    throw new BadRequestError('Mot so san pham da được cập nhật ,vui lòng trở lại giỏ hàng')
   }

   const newOrder=await order.create({
    order_userId:userId,
    order_checkout:checkout_order,
    order_shipping:user_address,
    order_payment:user_payment,
    order_products:shop_order_ids_new
   })
   //truong hop neu insert thanh cong thi remove product co trong cart
   if(newOrder){
    // remove product in my cart
   }


   return newOrder
 }

  /*
   1>Query Orders [Users]
  */
 static async getOrderByUser(){

 }


   /*
   1>Query Orders Using Id [Users]
  */
   static async getOneOrderByUser(){
  
   }


     /*
   1>Query cancel Orders Using Id [Users]
  */
 static async cancelOrderByUser(){
  
 }


   /*
   1>Query update Orders status [Users]
  */
   static async updateUserStatusByShop(){
    
   }
}

module.exports= CheckoutService