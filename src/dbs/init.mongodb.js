'use strict'

const { default: mongoose } = require("mongoose")
const {db:{host,name,port}}=require('../configs/config.mongodb')
const connecstr=`mongodb://${port}/${name}`
//const connecstr=

const {countconnect}=require('../helpers/check.connect')


class Database{
    constructor(){
       
        this.connect()
    }
    

    connect(type='mongodb'){
        if(1===1){
            mongoose.set('debug',true)
            mongoose.set('debug',{color:true})
        }
            mongoose.connect(connecstr)
            .then(()=>{console.log('ket noi thanh cong');countconnect()})
            .catch(err=>{
                console.log('ket noi không thành cong')
            })
     
        
    }

     static getInstance(){
            if(!Database.instance){
                Database.instance=new Database()
            }
            return  Database.instance
         }
}
const instanceMongodb=Database.getInstance()

module.exports=instanceMongodb