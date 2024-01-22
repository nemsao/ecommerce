'use strict'

'use strict'
const {Schema,model} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME='Discount'
const COLLECTION_NAME='Discounts'


// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name:{type:String,required:true},
    discount_description:{type:String,required:true},
    discount_type:{type:String,default:'fixed_amount'},  // percentage
    discount_value:{type:Number,required:true}, //10.000 , 10
    discount_code:{type:String,required:true},// Discount Code
    discount_start_date:{type:Date,required:true},
    discount_end_date:{type:Date,required:true},
    discount_max_uses:{type:Number,required:true}, //so luong discount duoc ap dung
    discount_uses_count:{type:Number,required:true}, // so luong discount da su dung
    discount_users_used:{type:Array,default:[]},// ai da su dung
    discount_max_uses_per_user:{type:Number,required:true}, // so luong cho phep toi da moi user su dung
    discount_min_order_value:{type:Number,required:true},
    discount_shopId:{type:Schema.Types.ObjectId,ref:'Shop'},

    discount_is_active:{type:Boolean,default:true},
    discount_applies_to:{type:String,default:true,enum:['all','specific']},
    discount_product_ids:{type:Array,default:[]},//cac san pham duoc luuu tru

    

 
},{
    collection:COLLECTION_NAME,
    timestamps:true
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);