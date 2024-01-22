const ProductService =require('../service/product.service')
const {OK,CREATED,SuccessResponse}=require('../core/success.response')
const ProductService2 =require('../service/product.service.xxx')
class ProductController{
   
   CreateProduct =async (req,res,next)=>{
      
            new SuccessResponse({
                  message:'Create new product Success',
                  metadata:await ProductService2.createProduct(req.body.product_type,
                    {
                        ...req.body,
                        product_shop:req.user.userId
                    }
                    )
           
                 }).send(res)

            }
   updateProduct =async (req,res,next)=>{
      
              new SuccessResponse({
                    message:'Update product Success',
                    metadata:await ProductService2.updateProduct(req.body.product_type,req.params.productId,
                      {
                        ...req.body,
                        product_shop:req.user.userId

                      }
                      )
             
                   }).send(res)
  
              }
  publishProductByShop=async (req,res,next)=>{
            new SuccessResponse({
                  message:'Publish product Success',
                  metadata:await ProductService2.publishProductByShop(
                    {
                        product_id:req.params.id,
                        product_shop:req.user.userId
                    }
                    )
           
                 }).send(res)
      }
   unPublishProductByShop=async (req,res,next)=>{
        new SuccessResponse({
              message:'unPublish product Success',
              metadata:await ProductService2.unPublishProductByShop(
                {
                    product_id:req.params.id,
                    product_shop:req.user.userId
                }
                )
       
             }).send(res)
  }
                 //QUERY ///

                 /**
                  * @desc Get all Draft for shop
                  * @param {Number} Limit
                  * @param {Number} SKIP
                  * @param {JSON} 
                  */
    getAllDraftForShop=async (req,res,next)=>{
      
                        new SuccessResponse({
                              message:'Get list drafft success',
                              metadata:await ProductService2.findAllDraftForShop(
                                {
                                    
                                    product_shop:req.user.userId
                                }
                                )
                       
                             }).send(res) 
                 //END QUERY ///
           }
  getAllPublishForShop=async (req,res,next)=>{
      
            new SuccessResponse({
                  message:'Get list drafft success',
                  metadata:await ProductService2.findAllPublishForShop(
                    {
                        product_shop:req.user.userId
                    }
                    )
           
                 }).send(res) 
     //END QUERY ///
}
   getListSearchProduct=async (req,res,next)=>{
      
  new SuccessResponse({
        message:'Get list getListSearchProduct success',
        metadata:await ProductService2.searchProduct(req.params)
 
       }).send(res) 
//END QUERY ///
}

   finAllProducts=async (req,res,next)=>{
      
                      new SuccessResponse({
                            message:'Get list findAllProduct success',
                            metadata:await ProductService2.findAllProduct(req.query)
                    
                          }).send(res) 
//END QUERY ///
}
  
    finProducts=async (req,res,next)=>{
      
  new SuccessResponse({
        message:'Get list findProduct success',
        metadata:await ProductService2.findProduct({
            product_id:req.params.product_id})

      }).send(res) 
//END QUERY ///
}


}

module.exports=new ProductController()
