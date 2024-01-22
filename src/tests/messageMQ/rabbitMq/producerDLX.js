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

         try{
        
        const conn=await amqp.connect(rabbitSetting)
        console.log('connection created ...')
      
        const channel=await conn.createChannel()
        console.log('channel created ...')

        const res=await channel.assertQueue(queue)
        console.log('Queue created ...')


        const notifycationExchange= 'notifycationExchange' // ntf direct
        
        const notiQueue='notifycationQueueProcess'// assertQueue
        const notifycationExchangeDLX='notifycationExchangeDLX'//notification assert
        const notifycationRoutingKeyDLX='notifycationRoutingKeyDLX' // asert
             
        // 1.create Exchange
        await channel.assertExchange(notifycationExchange,"direct",{
            durable:true
        })
        // 2.
        const queueResult =await channel.assertQueue(notiQueue,{
            exclusive:false,  //cho phep cac ket noi truy cap cung vao hang doi

            deadLetterExchange:notifycationExchangeDLX,
            deadLetterRoutingKey:notifycationRoutingKeyDLX
        })

        // 3.by queue 
        await channel.bindQueue(queueResult.queue,notifycationExchange) 
        

        // 4.Send message 
        const msg='Send a noti ưe have'

       console.log("product:: " ,msg)
       await channel.sendToQueue(queueResult.queue,Buffer.from(msg),{
        expiration:'10000'
       })

       setTimeout(()=>{
        conn.close();
        process.exit(0);
       },500)
    }catch(err){
        console.log(err)
    }
}