const {Kafka}=require('kafkajs')

const kafka=new Kafka({
    clientId:'my-app',
    brokers:['localhost:9092'],
    enforceRequestTimeout: false
})

const consumer=kafka.consumer({groupId:'test-group'})


const RunRunConsumer=async ()=>{


  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  })
  
}
RunRunConsumer().catch(console.error)