'use strict'
const DiscountService =require('../service/discount.service')
const {OK,CREATED,SuccessResponse}=require('../core/success.response')

class DiscountController{
    createDiscountCode=async (req,res,next)=>{
        new SuccessResponse({
            message:'Susses code generations',
            metadata: await DiscountService.createDisscountCode({
                ...req.body,
                shopId:req.user.userId
            })
        }).send(res)
    }
    getAllDiscountCode=async (req,res,next)=>{
        new SuccessResponse({
            message:'Susses get Discount code ',
            metadata: await DiscountService.getAllDiscountCode({
                ...req.query,
                shopId:req.user.userId
            })
        }).send(res)
    }
    getDiscountAmount=async (req,res,next)=>{
        new SuccessResponse({
            message:'Susses get Discount Amounte ',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
    getAllDiscountWithProducts=async (req,res,next)=>{
        new SuccessResponse({
            message:'Susses get All Discount with products',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }
    getAllDiscountCodesByShop=async (req,res,next)=>{
        new SuccessResponse({
            message:'Susses get All Discount by shop',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query
                
            })
        }).send(res)
    }
}

module.exports=new DiscountController
