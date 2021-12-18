require('dotenv/config')
require('express-async-errors')
const express = require('express')
const http = require('http')
const io = require('socket.io')()
const next = require('next')
const path = require('path')

const knexfile = require('./knexfile')
const db = require('knex')(knexfile.development)

const app = express()
const server = http.createServer(app)
const nextApp = next({ dev: true, dir: path.join(__dirname, 'client') })
const handler = nextApp.getRequestHandler()

io.attach(server)

const { getAllDrivers } = require('./sockets/getAllDriver')
const expressRoute = require('./routes')

nextApp
	.prepare()
	.then(() => {
		/**
		 * @description express setup funcionality
		 */

		app.use(express.json())
		app.use(expressRoute)

		/**
		 * @description socket.io setup funcionality
		 */

		io.on('connection', (socket) => {
			getAllDrivers(io, socket, db)
		})

		app.get('**', (req, res) => handler(req, res))

		server.listen(3000, () => console.log('server is running'))
	})
	.catch((err) => console.error(err.message))
