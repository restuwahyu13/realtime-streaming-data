const { Kafka } = require('kafkajs')

const kafka = new Kafka({
	clientId: 'node-app',
	brokers: ['localhost:9092'],
	requestTimeout: 3000,
	connectionTimeout: 6000,
	ssl: false
})

exports.producer = async (eventName, data) => {
	const producer = kafka.producer()

	// event kafka producer notification
	await producer.on('producer.connect', () => console.info('producer kafka connected'))
	await producer.on('producer.disconnect', () => console.error('producer kafka disconnect'))
	await producer.on('producer.network.request_timeout', () => console.error('producer kafka network timeout'))

	await producer.connect()
	await producer.send({
		topic: eventName,
		messages: data,
		acks: true,
		compression: 1
	})

	await producer.disconnect()
}

exports.consumer = async (eventName, callback) => {
	const consumer = kafka.consumer({
		groupId: 'test-group',
		maxBytes: 1048576000, // 1GB
		maxBytesPerPartition: 1048576000, // 1GB
		sessionTimeout: 60000,
		heartbeatInterval: 6000,
		rebalanceTimeout: 30000
	})

	// event kafka consumer notification
	await consumer.on('consumer.connect', () => console.info('consumer kafka connected'))
	await consumer.on('consumer.disconnect', () => console.error('consumer kafka disconnect'))
	await consumer.on('consumer.crash', () => console.error('consumer kafka crash'))
	await consumer.on('consumer.stop', () => console.error('consumer kafka stop'))
	await consumer.on('consumer.network.request_timeout', () => console.error('consumer kafka network timeout'))

	await consumer.connect()
	await consumer.subscribe({ topic: eventName, fromBeginning: true })
	await consumer.run({
		autoCommit: true,
		eachMessage: callback
	})
}
