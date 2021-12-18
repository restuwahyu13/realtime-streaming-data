const { toKiloMeter } = require('../helpers//toKm')
const { consumer } = require('../libs/kafka')

exports.getAllDrivers = function (io, socket, db) {
	socket.on(`client:send`, async (userId) => {
		let getOrderByMitra = await db('order')
			.select('*', db.raw('to_json(location) as location'), db.raw('to_json(location) as destination'))
			.where('customer_id', userId)
			.andWhere('status', 'pesanan menunggu konfirmasi')
			.andWhere('order_date', '>=', `${new Date().toLocaleDateString()}T00:00:00.00Z`)
			.first()

		let getAllDriverActive = []

		if (getOrderByMitra) {
			// get data from datase if user reloading data
			if (!getAllDriverActive.length) {
				getAllDriverActive = await db('point_location')
					.select('id', 'driver_id', 'active', 'latitude', 'longitude')
					.where('active', true)

				const newGetAllDriverActive = getAllDriverActive
					.map((val) => {
						const latitude = parseFloat(getOrderByMitra.location.latitude)
						const longitude = parseFloat(getOrderByMitra.location.longitude)

						return toKiloMeter(latitude, longitude, val.latitude, val.longitude) <= 10 ? val : false
					})
					.filter((val) => typeof val != 'boolean')

				io.emit(`server:send:${userId}`, JSON.stringify(newGetAllDriverActive))
			}

			// get data from kafka if user not reloading data
			await consumer('pointLocation', async ({ topic, partition, message }) => {
				const streamingPayload = message.value.toString()
				getAllDriverActive = JSON.parse(streamingPayload)

				const newGetAllDriverActive = getAllDriverActive
					.map((val) => {
						const latitude = parseFloat(getOrderByMitra.location.latitude)
						const longitude = parseFloat(getOrderByMitra.location.longitude)

						return toKiloMeter(latitude, longitude, val.latitude, val.longitude) <= 10 ? val : false
					})
					.filter((val) => typeof val != 'boolean')

				io.emit(`server:send:${userId}`, JSON.stringify(newGetAllDriverActive))
			})
		}
	})
}
