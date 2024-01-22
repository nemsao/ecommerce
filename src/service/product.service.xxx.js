'use strict'
const {product,clothing,electronic,furniture}=require('../model/product.model')
const {BadRequestError,ForbiddenError}=require('../core/error.response')
const { findAllDraftForShop ,publishProductByShop
    ,findAllPublishForShop,unPublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct,
    updateProductById} = require('../model/respositories/product.repo')
const { removeUndefinedObject,updateNestedObjectParser  } = require('../ultils')
const { insertInventory } = require('../model/respositories/inventory.repo')
const { pushNotiToSystem } = require('./notification.service')


// define Factory class to create product
class ProductFactory{
    /*
    type:'Clothing',

    */
    static productRegistry={} //key-class


    static regisgerProducType(type,classRef){
        ProductFactory.productRegistry[type]=classRef

    }
    static async createProduct(type ,playload){
       const productClass= ProductFactory.productRegistry[type]
       if(!productClass)throw new BadRequestError('Ínvalid Product Types ::',type )
       return new productClass(playload).createProduct()
    }

    static async updateProduct(type,productId,playload){
        const productClass= ProductFactory.productRegistry[type]
        if(!productClass)throw new BadRequestError('Invalid Product Types ::',type )
        
        return new productClass(playload).updateProduct(productId)
     }

    // PUT //
    static async publishProductByShop({product_shop,product_id}){
            const shop = publishProductByShop({product_shop,product_id})

            return shop
        }
    
    static async unPublishProductByShop({product_shop,product_id}){
            const shop = unPublishProductByShop({product_shop,product_id})

            return shop
        
        }
    // END PUT //
 
    


       //query ///

    
    static async findAllDraftForShop({product_shop , limit=50 , skip=0}){
        
        const query={ product_shop ,isDraft:true}

        return await findAllDraftForShop({query,limit,skip})

    }
    static async findAllPublishForShop({product_shop , limit=50 , skip=0}){ 
        const query={ product_shop ,isPublished:true}
        return await findAllPublishForShop({query,limit,skip})
}
    static async searchProduct({keySearch}){
          return await searchProductByUser({keySearch})
  }
    static async findAllProduct({limit=50,sort='ctime',page=1,filter={isPublished:true}}){
        return await findAllProduct({ limit,sort,filter,page,
        select:['product_name','product_price','product_thumb']})
  }
    static async findProduct({product_id}){
    return await findProduct({product_id,unSelect:['__v']})
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
        const newProduct= await product.create({...this,
        _id:product_id
        })
         if(newProduct){
            //adđ product_stock in inventory collection
            await insertInventory({
                productId:newProduct._id,
                shopId:this.product_shop,
                stock:this.product_quantity
             })
             pushNotiToSystem({
                type:'SHOP-001',
                receivedId:1,
                senderId:this.product_shop,
                options:{
                    product_name:this.product_name,
                    shop_name:this.product_shop
                }
             }).then(rs=>{ console.log(rs)}).catch(
                console.error
             )
         }
        return newProduct
    }

    async updateProduct (productId,bodyUpdate){
         console.log(' body :::',bodyUpdate)
        return await updateProductById({productId,bodyUpdate,model:product})

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

    async updateProduct(productId){
     
        // 1.remove attribute has null undefined
        const objectParams=removeUndefinedObject(this)
        // 2.check for Object to update

        if(objectParams.product_attributes){
              // update child
              await updateProductById({
                productId,
                bodyUpdate:updateNestedObjectParser(objectParams.product_attributes),
                model:clothing})
        }
      const updateProduct=await super.updateProduct(productId,updateNestedObjectParser(objectParams.product_attributes))

      return updateProduct
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
async updateProduct(productId){
    
    // 1.remove attribute has null undefined
    const objectParams=removeUndefinedObject(this)
    // 2.check for Object to update
     
    if(objectParams.product_attributes){
          // update child
          await updateProductById({
            productId,
            bodyUpdate:updateNestedObjectParser(objectParams.product_attributes),
            model:electronic})
    }
  const updateProduct=await super.updateProduct(productId,updateNestedObjectParser(objectParams.product_attributes))

  return updateProduct
} 
}

class Furniture extends Product{
    async createProduct(){
    const newFurniture= await furniture.create({
        ...this.product_attributes,
        product_shop:this.product_shop
    })
    if(!newFurniture) throw new BadRequestError('create new Furniture Product Error ')

    const newProduct=await super.createProduct(newFurniture._id)
    if(!newProduct) throw new BadRequestError('create new Product Error ')
    return newProduct

}
async updateProduct(productId){
    console.log("1 :::",this)
    // 1.remove attribute has null undefined
    const objectParams=removeUndefinedObject(this)
    // 2.check for Object to update
    console.log("2 :::",objectParams)
    if(objectParams.product_attributes){
          // update child
          await updateProductById({
            productId,
            bodyUpdate:updateNestedObjectParser(objectParams.product_attributes),
            model:furniture})
    }
    
  const updateProduct=await super.updateProduct(productId,updateNestedObjectParser(objectParams))

  return updateProduct
} 
}

// register productTypes
ProductFactory.regisgerProducType('Electronics',Electronics)
ProductFactory.regisgerProducType('Clothing',Clothing)
ProductFactory.regisgerProducType('Furniture',Furniture)

module.exports=ProductFactory