'use strict'


//!dmbg
const mongoose = require('mongoose'); // Erase if already required
const {model,Schema,Types}=require('mongoose')
const COLLECTION_NAME='Shop'
const DOCUMENT_NAME='Shop'
// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxLength:150
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    verify:{
        type:mongoose.Schema.Types.Boolean,
        default:false
    },
    roles:{
      type:Array,
      default:{}
    },
    password:{
        type:String,
        required:true,
    },

},
        {
            timestamps:true,
            collection:COLLECTION_NAME
        } 
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);