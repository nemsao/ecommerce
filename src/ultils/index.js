'use strict'

const _=require('lodash')
const {Types}=require('mongoose')
const convertToObjectIdMongoDb=id=>new Types.ObjectId(id)
const getInfoData=({fileds=[],object={}})=>{
    return _.pick(object,fileds )

}

//['a','b'] ={a:1,b:1}
const getSelectData=(select = [])=>{
    return  Object.fromEntries(select.map(el=>[el,1]))
}

//['a','b'] ={a:0,b:0}
const unSelectData=(select = [])=>{
    return  Object.fromEntries(select.map(el=>[el,0]))
}
const removeUndefinedObject=obj=>{
    Object.keys(obj).forEach(k=>{
        if(obj[k]==null){
            delete obj[k]
        }
    })
    return obj
}
const updateNestedObjectParser=obj=>{
    const final={}
    Object.keys(obj).forEach(k=>{
        console.log(' [3] ::',obj[k])
        if(typeof obj[k]=== 'object' && !Array.isArray(obj[k])  )
        {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a=>{
                final[`${k}.${a}`]=response[a]
            })
        }else{
            final[k]=obj[k]
        }
    })
    console.log(' final ::', final)
    return final
}
module.exports={
    getInfoData,
    getSelectData,
    unSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongoDb
}
