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
    const enterprise='youtube'
         try{
        
        const conn=await amqp.connect(rabbitSetting)
        console.log('connection created ...')
      
        const channel=await conn.createChannel()
        console.log('channel created ...')

        const res=await channel.assertQueue(queue)
        console.log('Queue created ...')
       
        
        console.log('Waiting for message ',enterprise)

        channel.consume(queue,message=>{
            let employee=JSON.parse(message.content.toString())
            console.log('Reiceived employer ',employee.name)

        })
    }catch(err){
        console.log(err)
    }
}