'use strict'
const CartService =require('../service/cart.service')
const {OK,CREATED,SuccessResponse}=require('../core/success.response')

class CartController{
   addToCart =async (req,res,next)=>{
    //new 
    new SuccessResponse({
        message:'Create new cart Success ',
        metadata:await CartService.addToCart(req.body)
    }).send(res)
   }
   update =async (req,res,next)=>{
    //new 
    new SuccessResponse({
        message:'Upadte new cart Success ',
        metadata:await CartService.addToCartV2(req.body)
    }).send(res)
   }
   delete =async (req,res,next)=>{
    //new 
    new SuccessResponse({
        message:'Delete item in  cart Success ',
        metadata:await CartService.deleteUserCart(req.body)
    }).send(res)
   }
   listToCart =async (req,res,next)=>{
    //new 
    new SuccessResponse({
        message:'Get cart Success ',
        metadata:await CartService.getListUserCart(req.body)
    }).send(res)
   }
}

module.exports=new CartController