'use strict'

const { result } = require('lodash')
const {product,electronic,clothing,furniture}=require('../../model/product.model')
const {Types}=require('mongoose')
const { getSelectData,unSelectData, convertToObjectIdMongoDb } = require('../../ultils')
const findAllDraftForShop=async ({query,limit,skip})=>{
   return await queryProduct({query,limit,skip})
}


const findAllPublishForShop=async ({query,limit,skip})=>{
    return await queryProduct({query,limit,skip})
 }
 
const searchProductByUser=async ({keySearch})=>{
  const regexSearch=new RegExp(keySearch)
  const results=await product.find({
    isPublished:true,
    $text:{$search: regexSearch}})
    .sort({score:{$meta:'textScore'} })
    .lean()
    
  return results
}
const publishProductByShop=async ({product_shop,product_id})=>{
    
    const foundShop=await product.findOne({
    product_shop,
    _id:new Types.ObjectId(product_id)

})
    if(!foundShop)return null
   
    foundShop.isDraft=0
    foundShop.isPublished=1
   
    const{modifiedCount} =await foundShop.updateOne(
        {
          $set: {
            isDraft: false,
            isPublished: true
          }
        }
      );
      

    return modifiedCount

}

const unPublishProductByShop=async ({product_shop,product_id})=>{
    
  const foundShop=await product.findOne({
  product_shop,
  _id:new Types.ObjectId(product_id)

})
  if(!foundShop)return null
 
  foundShop.isDraft=0
  foundShop.isPublished=1
 
  const{modifiedCount} =await foundShop.updateOne(
      {
        $set: {
          isDraft: true,
          isPublished: false
        }
      }
    );
    

  return modifiedCount

}
const findAllProduct=async ({limit,sort,page,filter,select})=>{
    const skip=(page-1)*limit
    const sortBy=sort ==='ctime'?{_id:-1} :{_id:1}
    const products=await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products
}
const queryProduct = async ({query,limit,skip})=>{
    return await product.find(query).
    populate('product_shop','name email -_id')
    .sort({updateAt:-1})
    .skip({skip:skip})
    .limit({limit:limit})
    .lean()
    .exec()
}
const findProduct=async ({product_id,unSelect})=>{
 return await product.findById(product_id)
  .select(unSelectData(unSelect))
 
}

const updateProductById=async ({
  productId,
  bodyUpdate,
  model,
  isNew = true
})=>{
  return await model.findByIdAndUpdate(productId,bodyUpdate,{new:isNew})

}
const getProductById=async(productId)=>{
  return await product.findOne({_id: convertToObjectIdMongoDb(productId)}).lean()
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
const findProductInCart = async (products, product) => {
  const foundProducts = [];

  for (let i = 0; i < products.length; i++) { console.log("san pham trong ggio ::",products[i].productId)
    if (products[i].productId === product.productId) {
     
      return true
    }
  }

};
module.exports={
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct,
    updateProductById,getProductById,
    checkProductByServer,
    findProductInCart
    
}