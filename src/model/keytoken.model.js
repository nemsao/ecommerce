'use strict'
const {Schema,model} = require('mongoose'); // Erase if already required
const COLLECTION_NAME='Key'
const DOCUMENT_NAME='Keys'
// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
    
        ref:'Shops',
    },
    publicKey:{
        type:String,
        required:true,
       
    },
    refreshTokensUsed:{
        type:Array,
        default:[] //Refresh token were used
    },
    refreshToken:{
        type:String,
        required:true
    },
    privateKey:{
        type:String,
        required:true,
    }
},{
    collection:COLLECTION_NAME,
    timestamps:true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);