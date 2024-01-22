'use strict'
const {getSelectData,unSelectData}=require('../../ultils')
const findAllDiscountCodeUnSelect=async ({
   limit=50,page=1,sort='ctime',filter,unSelect,model
})=>{
    const skip=(page-1)*limit
    const sortBy=sort ==='ctime'?{_id:-1} :{_id:1}
    const documents=await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectData(unSelect))
    .lean()

    return documents
}

const findAllDiscountCodeSelect=async ({
    limit=50,page=1,sort='ctime',filter,Select,model
 })=>{
     const skip=(page-1)*limit
     const sortBy=sort ==='ctime'?{_id:-1} :{_id:1}
     const documents=await model.find(filter)
     .sort(sortBy)
     .skip(skip)
     .limit(limit)
     .select(getSelectData(Select))
     .lean()
 
     return documents
 }
 
 const checkDiscoubntExixt=({model,filter})=>{
    return  model.findOne(filter).lean()
 }
module.exports={
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    checkDiscoubntExixt
}