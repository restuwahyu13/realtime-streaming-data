const express = require('express')
const router = express.Router()
const { producer } = require('../libs/kafka')
const knexfile = require('../knexfile')
const db = require('knex')(knexfile.development)

router.get('/', (req, res) => {
	res.status(200).json({ message: 'Rest API Working' })
})

router.post('/point-location', async (req, res) => {
	const payload = {
		driver_id: req.body.driver_id,
		address: req.body.address,
		city: req.body.city,
		state: req.body.state,
		postcode: req.body.postcode,
		country: req.body.country,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		active: true,
		created_at: new Date()
	}

	const insertData = await db('point_location').insert(payload)

	if (insertData) {
		// get driver with status aktif
		let getAllDriverActive = await db('point_location')
			.select('id', 'driver_id', 'active', 'latitude', 'longitude')
			.where('active', true)

		// streaming data into kafka after inserting data for realtime result driver aktif simulation like on gps
		// this is only simulation, you can explore this simulation with your logic
		producer('pointLocation', [{ key: `${Math.random()}`, value: JSON.stringify(getAllDriverActive) }])

		return res.status(200).json({ message: 'Add new point location success' })
	} else return res.status(200).json({ message: 'Add new point location  failed' })
})

router.post('/order', async (req, res) => {
	const payload = {
		'no_order': req.body.no_order,
		'customer_id': req.body.customer_id,
		'name': req.body.name,
		'category': req.body.category,
		'price': req.body.price,
		'payment_type': req.body.payment_type,
		'notes': req.body.notes,
		'location.address': req.body.location.address,
		'location.city': req.body.location.city,
		'location.state': req.body.location.state,
		'location.postcode': req.body.location.postcode,
		'location.country': req.body.location.country,
		'location.latitude': req.body.location.latitude,
		'location.longitude': req.body.location.longitude,
		'destination.address': req.body.destination.address,
		'destination.city': req.body.destination.city,
		'destination.state': req.body.destination.state,
		'destination.postcode': req.body.destination.postcode,
		'destination.country': req.body.destination.country,
		'destination.latitude': req.body.destination.latitude,
		'destination.longitude': req.body.destination.longitude,
		'status': req.body.status,
		'order_date': new Date(),
		'created_at': new Date()
	}

	const insertData = await db('order').insert(payload)
	if (insertData) return res.status(200).json({ message: 'Add new order success' })
	else return res.status(200).json({ message: 'Add new order failed' })
})

module.exports = router
