'use strict'
const _SECONDS=5000
const os=require('os')
const process=require('process')
const { default: mongoose } = require("mongoose")
//check overload
const checkoverload=()=>{
    setInterval(()=>{
        const numConnect= mongoose.connections.length
        const numCores=os.cpus().length;
        const memoryUsage=process.memoryUsage().rss;

        const maxConnections=numConnect*5;
            //console.log('áctivate connection')
           // console.log(`Memory usage ${memoryUsage/1024/1024 } MB`)
        if(numConnect===maxConnections){
            console.log('Connection overload')
        }
    },_SECONDS)
}

//count connect
const countconnect=()=>{ 
    const numConnect= mongoose.connections.length
    console.log(`Number of connection :: ${numConnect} `)
}
module.exports={countconnect,checkoverload}