const amqp=require('amqplib')

const rabbitSetting={
    protocol:'amqp',
    hostname:'localhost',
    port:5672,
    username:'nu',
    password:'12345',
    vhost:'/',
    authMechanism:['PLAIN','AMQPLAIN','EXTERNAL']
}
connect()

async function connect(){
    const  queue='employees'
   const msgs=[
            {"name":"Nam",'enterprise':"youtube"},
            {"name":"Nam",'enterprise':"youtube"},
            {"name":"Nam",'enterprise':"youtube"},
            {"name":"Nam",'enterprise':"youtube"},
            {"name":"Nam",'enterprise':"youtube"},
            {"name":"Nam",'enterprise':"youtube"},
        ]
         try{
        
        const conn=await amqp.connect(rabbitSetting)
        console.log('connection created ...')
      
        const channel=await conn.createChannel()
        console.log('channel created ...')

        const res=await channel.assertQueue(queue)
        console.log('Queue created ...')
        for(let msg in msgs){
            await channel.sendToQueue(queue,Buffer.from(JSON.stringify(msgs[msg])))
            console.log('Message send to queue ',queue)
        }
    }catch(err){
        console.log(err)
    }
}