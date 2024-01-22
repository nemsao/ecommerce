const app = require("./src/app");
const PORT=process.env.PORT
const server =app.listen(PORT,()=>{
    console.log (`WSV eComerce start with ${PORT}`)
})

process.on('SIGNT',()=>{
    server.close(()=>{
        console.log('exit')
    })
})