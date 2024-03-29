const compression = require('compression')
const express=require('express')
const { default: helmet } = require('helmet')
const morgan=require('morgan')
 
const app=express()





require('dotenv').config()

app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
const {checkoverload}=require('./helpers/check.connect')
//init middleware



//init db
require('./dbs/init.mongodb')
checkoverload()
//init routes

app.use('/',require('./routes'))

//handling error
app.use((req,res,next)=>{
    const error=new Error('Not Found')
    error.status=404
    next(error)
})
app.use((error,req,res,next)=>{
    const statusCode =error.status||500
    return res.status(statusCode).json(
        { 
            status:'error',
            code:statusCode,
            stack:error.stack,
            message:error.message
        }
    )
})
module.exports=app