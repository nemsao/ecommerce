const AccessService =require('../service/access.service')
const {OK,CREATED,SuccessResponse}=require('../core/success.response')
class AccessController{
      handleRefreshToken =async (req,res,next)=>{
            // new SuccessResponse({
            //  message:'Get Tokens Success',
            //  metadata:await AccessService.handleRefreshToken( req.body.refreshToken)
      
            // }).send(res)

            //V2 fixed
            new SuccessResponse({
                  message:'Get Tokens Success',
                  metadata:await AccessService.handleRefreshToken( {
                        refreshToken:   req.refreshToken,
                        user:req.user,
                        keyStore:req.keyStore
                  })
           
                 }).send(res)
           }

           
     login =async (req,res,next)=>{
      new SuccessResponse({
       metadata:await AccessService.login(req.body)

      }).send(res)
     }
     logout =async (req,res,next)=>{
      new SuccessResponse({
       message:'Log Out Success',
       metadata:await AccessService.logout( req.keyStore)

      }).send(res)
     }
   
   signUp=async (req,res,next)=>{
    
      //      return res.status(200).json(
      //       {
      //           message:'',
      //           metadata:""
      //       }
      //      )

           new CREATED({
            message:'Registered Ok',
            metadata:await AccessService.signup(req.body),
            options:{
                  limit:10
            }
           }).send(res)
           
      }
     
   
}

module.exports=new AccessController()
