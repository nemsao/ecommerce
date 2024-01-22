'use strict'
const mongoose = require('mongoose'); // Erase if already required
const slugify=require('slugify')
const COLLECTION_NAME='Products'
const DOCUMENT_NAME='Product'
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true
       
    },
    product_thumb:{
        type:String,
        required:true,
       
    },
    product_description:String,
    product_price:{
        type:Number,
        required:true,
    },
    product_quantity:{
        type:Number,
        required:true
       
    },
    product_slug:{
        type:String },
    product_type:{
        type:String,
        required:true,
        enum:['Electronics','Clothing','Furniture']
    },
    product_shop:{type:mongoose.Schema.Types.ObjectId,ref:'Shop' },
    product_attributes:{
        type:mongoose.Schema.Types.Mixed,
        required:true},
       //more
       product_ratingAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0'],

        //rounding rating

        set:(val)=>Math.round(val * 10)/10
       },
       product_variations:{
        type:Array,
        default:[]
       },
       isDraft:{
        type:Boolean,
        default:true,
        index:true,
        select:false
       },
       isPublished:{type:Boolean,default:false,index:true,select:false
       }
    
},{
    collection:COLLECTION_NAME,
    timestamps:true
});
//create index for search
productSchema.index({ product_name: 'text',product_description: 'text'})


// Document middleware runs before .save() and .create()...

productSchema.pre('save',function ( next ){
    this.product_slug=slugify(this.product_name,{lower:true})
    next()
})
//define the product type = clothing

const clothingShema=new mongoose.Schema({
    brand:{type:String,require:true},
    size:String,
    material:String
},{
    collection:'clothes',
    timestamps:true
}
)

//define the product type = electronic

const electronicShema=new mongoose.Schema({
    manufacture:{type:String,require:true},
    model:String,
    color:String
},{
    collection:'electronics',
    timestamps:true
}
)
const furnitureShema=new mongoose.Schema({
    brand:{type:String,require:true},
    size:String,
    material:String
},{
    collection:'furniture',
    timestamps:true
}
)
//Export the model
module.exports ={product: mongoose.model(DOCUMENT_NAME,productSchema ),
                 electronic: mongoose.model('Electronics',electronicShema),
                 clothing: mongoose.model('Clothes',clothingShema ),
                 furniture: mongoose.model('Furniture',furnitureShema )


}