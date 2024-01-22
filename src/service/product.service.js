'use strict'
const {product,clothing,electronic}=require('../model/product.model')
const {BadRequestError,ForbiddenError}=require('../core/error.response')

// define Factory class to create product
class ProductFactory{
    /*
    type:'Clothing',

    */
    static async createProduct(type,playload){
       switch(type){
        case 'Electronics':
            return new Electronics(playload).createProduct()
        case 'Clothing':
            return new Clothing(playload).createProduct()
        default:
            throw new BadRequestError('Ínvalid Product Types ::',type )
       }
    }
}
/*
  product_name:{type:String,required:true},
    product_thumb:{type:String,required:true,},
    product_description:String,
    product_price:{type:Number,required:true,},
    product_quantity:{type:Number,required:true},
    product_type:{ type:String,required:true,enum:['Electronics','Clothing','Furniture']},
    product_shop:{type:mongoose.Schema.Types.ObjectId,ref:'Shop' },
    product_type:{ type:mongoose.Schema.Types.Mixed,required:true,}
    product_attributes
*/

//define base product class



class Product{
    constructor({
        product_name,product_thumb,product_description,product_price,
        product_quantity,product_type,product_shop,product_attributes
    }){
         this.product_name=product_name,
         this.product_thumb=product_thumb,
         this.product_description=product_description,
         this.product_quantity=product_quantity,
         this.product_shop=product_shop,
         this.product_type=product_type,
         this.product_price=product_price,
         this.product_attributes=product_attributes
    }
    async createProduct(product_id){
        return await product.create({...this,
        _id:product_id
        })
    }
}

//Define sub-class for different product types Clothing

class Clothing extends Product{
    async createProduct(){
    const newClothing= await clothing.create({
        ...this.product_attributes,
        product_shop:this.product_shop
    })
    if(!newClothing) throw new BadRequestError('create new Clothing Product Error ')

    const newProduct=await super.createProduct(newClothing._id)
    if(!newProduct) throw new BadRequestError('create new Product Error ')
    return newProduct

}
}

class Electronics extends Product{
    async createProduct(){
    const newElectronic= await electronic.create({
        ...this.product_attributes,
        product_shop:this.product_shop
    })
    if(!newElectronic) throw new BadRequestError('create new electronic Product Error ')

    const newProduct=await super.createProduct(newElectronic._id)
    if(!newProduct) throw new BadRequestError('create new Product Error ')
    return newProduct

}
}
module.exports=ProductFactory