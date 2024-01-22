'use strict'

//level 0
// const config={
//     app:{
//         port:3000
//     },
//     db:{
//         host:'localhost',
//         port:27017,
//         name:'dev'
//     }
// }

//level 1
const dev={
    app:{
        port:process.env.DEV_APP_PORT||3000
    },
    db:{
        

        host:process.env.DEV_DB_HOST||'localhost',
        port:process.env.DEV_DB_PORT||'127.0.0.1',
        name:process.env.DEV_DB_NAME||'dev'
    }
}
const pro={
    app:{
        port:process.env.DEV_APP_PORT
    },
    db:{
        host:process.env.DEV_DB_HOST,
        port:process.env.DEV_DB_PORT,
        name:process.env.DEV_DB_NAME
    }
}
const config={dev,pro}
const env=process.env.NODE_ENV||'dev'
module.exports=config[env]