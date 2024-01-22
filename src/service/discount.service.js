'use strict'
const {BadRequestError,NotFoundError}=require('../core/error.response')
const discount=require('../model/discount.model')
const {convertToObjectIdMongoDb}=require('../ultils')
const {findAllProduct}=require('../model/respositories/product.repo')
const { findAllDiscountCodeUnSelect,
        findAllDiscountCodeSelect,
        checkDiscoubntExixt } = require('../model/respositories/discount.repo')
const { product } = require('../model/product.model')

/**
 *     Discount Service
 * 

 *     1-Generate Discount Code [Shop/Admin]
       2-Get discount amount [User]
       3-Get all discount Codes [User/Shop]
       4-Verify discount Code [user]
       5-Delete discount Code [Admin/Shop]
       6-Cancel discount Code [user]
 */

       class DiscountService{
        static async createDisscountCode(paload){
            const {
                code,
                start_date,end_date,is_active,user_used,
                shopId,min_order_value, product_ids,
                applies_to,name,description,
                type,value,max_value,max_uses,uses_count,
                max_uses_per_user
                           } =paload
            //kiem tra
            // if(new Date()<new Date(start_date) || new Date() >new Date(end_date)){
            //     throw new BadRequestError('Discount code has been expried')
            // }
             if(new Date(start_date)>= new Date(end_date)){
                throw new BadRequestError('Start Date must later than end dtae')

             }

            const foundDiscount=await discount.findOne({
                discount_code:code,
                discount_shopId:convertToObjectIdMongoDb(shopId),

            }).lean()

             if(foundDiscount && foundDiscount.is_active){
                throw new BadRequestError('Discount exist')
             }

             const newDiscount =await discount.create({
    discount_name:name,
    discount_description:description,
    discount_type:type,  // percentage
    discount_value:value, //10.000 , 10
    discount_max_value:max_value,
    discount_code:code,// Discount Code
    discount_start_date:new Date(start_date),
    discount_end_date: new Date(end_date),
    discount_max_uses:max_uses, //so luong discount duoc ap dung
    discount_uses_count:uses_count, // so luong discount da su dung
    discount_users_used:user_used,// ai da su dung
    discount_max_uses_per_user:max_uses_per_user, // so luong cho phep toi da moi user su dung
    discount_min_order_value:min_order_value||0,
    discount_shopId:shopId,
    
    discount_is_active:is_active,
    discount_applies_to:applies_to,
    discount_product_ids:applies_to==='all'?[]:product_ids,//cac san pham duoc luuu tru

             })
        return newDiscount
        }
    static async updateDiscount(){

    }

    /**
     * Get all discount codes available 
     */
    static async getAllDiscountCodesWithProduct({
      code,shopId,userId,limit,page
    }){
         //create bindex for discount codes
         
         const foundDiscount=await discount.findOne({
            discount_code:code,
            discount_shopId:convertToObjectIdMongoDb(shopId),

        }).lean()
        
        if(!foundDiscount || !foundDiscount.discount_is_active){
            throw new NotFoundError('discount not exists!!!')

         }


         const {discount_applies_to,discount_product_ids}=foundDiscount
         let products
         if(discount_applies_to ==='all'){
            // get the product ids
            products=await findAllProduct({
                filter:{
                    product_shop:convertToObjectIdMongoDb(shopId),
                    isPublished:true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
      }
        if(discount_applies_to ==='specific'){
              // get the product ids
              products=await findAllProduct({
                filter:{
                    _id:{$in:discount_product_ids},
                    isPublished:true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
        }
        console.log("products :::" ,products)
       return products
    }

    static async getAllDiscountCodesByShop({limit,page,shopId}){
        const discounts=await findAllDiscountCodeSelect({
            limit:+limit,
            page:+page,
            filter:{
                discount_shopId:convertToObjectIdMongoDb(shopId),
                discount_is_active:true,

            },
            Select:['discount_name','discount_code'],
            model:discount
        })
        
        return discounts
    }
      /**Apply acount
       * PRODUCT :{
            productId,
            shopId,
            quantity,
            name,
            price
        },
        {
            productId,
            shopId,
            quantity,
            name,
            price
        }
       */
      static async getDiscountAmount({codeId,userId,shopId,products}){
        
            const foundDiscount=await checkDiscoubntExixt({
                model:discount,
                filter:{
                    discount_code:codeId,
                    discount_shopId:convertToObjectIdMongoDb(shopId)
            }
            })

            if(!foundDiscount){ throw new NotFoundError('discount does`n exists') }
           
            const {discount_is_active,
            discount_max_uses,discount_start_date, 
            discount_min_order_value,discount_end_date,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,discount_value } =foundDiscount
            if(!discount_is_active) throw new NotFoundError('discount is expired')
            if(!discount_max_uses) throw new NotFoundError('discount are out')

            // if(new Date()< new Date(discount_start_date) || new Date()> new Date(discount_end_date))
            // {
            //     throw new NotFoundError('discount ecode has expire')
            // }
            //check xem có et gí trị tối thiểu không
            let totalOder=0
            if(discount_min_order_value>0){
                //get total
                totalOder=products.reduce((acc,product)=>{
                    
                    return acc +(product.quantity*product.price)
                },0)
                if(totalOder< discount_min_order_value){
                    throw new NotFoundError('discount require aminium oder vallue of ',discount_min_order_value)
             
                }
            }
            // if(discount_max_uses_per_user>0){
            //     const userUserDiscount=discount_users_used.find(user=>user.userId=== userId)
            //     if(userUserDiscount){
            //             //...
            //     }
            // }
            //check xem discount này là fixxed amount
            const amount=discount_type==='fixed_amount'?discount_value:totalOder*(discount_value/100)

            return{
                totalOder,
                discount:amount,
                totalPrice:totalOder-amount
            }
      }



       static async deleteDisscountCode({ shopId,
        codeId}){

        const deleted=await discount.findOneAndDelete({
            discount_code:codeId,
            discount_shopId:convertToObjectIdMongoDb(shopId)
        })
        return deleted   
    }
       static async canelDiscountCode({codeId,shopId,userId}){
              const foundDiscount=await checkDiscountExists({
                model:discount,
                filter:{
                    discount_code:codeId,
                    discount_shopId:convertToObjectIdMongoDb(shopId)
                }
              })
              if(!foundDiscount) throw new NotFoundError('discount doesnt exitst')

              const result=await discount.findByIdAndUpdate(foundDiscount._id,{
                $pull:{
                    discount_users_used:userId
                },
                $inc:{
                    discount_max_uses:1,
                    discount_uses_count:-1
                }
              })
              return result
       }

    }

    module.exports=DiscountService