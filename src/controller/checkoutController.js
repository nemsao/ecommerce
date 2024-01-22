'use strict'
const CheckoutService =require('../service/checkout.service')
const {OK,CREATED,SuccessResponse}=require('../core/success.response')

class CheckoutController{
      CheckoutReview =async (req,res,next)=>{
    //new 
    new SuccessResponse({
        message:'Create new cart Success ',
        metadata:await CheckoutService.checkoutReview(req.body)
    }).send(res)
   }
   
}

module.exports=new CheckoutController()