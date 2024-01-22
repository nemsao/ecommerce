'use strict'

const { default: mongoose } = require("mongoose")
const connecstr='mongodb://127.0.0.1/dev'
mongoose.connect(connecstr)
.then(_=>{console.log('ket noi thanh cong')})
.catch(err=>{
    console.log('ket noi không thành cong')
})
module.exports=mongoose