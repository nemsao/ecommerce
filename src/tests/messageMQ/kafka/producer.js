const {Kafka}=require('kafkajs')
const { Partitioners } = require('kafkajs')



const kafka=new Kafka({
    clientId:'my-app',
    brokers:['localhost:9092']
})

const producer=kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })


const RunProducer=async ()=>{
    await producer.connect().then(console.log('kết nối thành công '))
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: 'Hello KafkaJS user!' },
      ],
    })
    
    await producer.disconnect()
}


RunProducer().catch(console.error)