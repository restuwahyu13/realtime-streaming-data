require('dotenv/config')
const path = require('path')

module.exports = {
	development: {
		client: process.env.DB_CLIENT,
		connection: {
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME
		},
		pool: {
			min: 1,
			max: 5
		},
		migrations: {
			directory: path.resolve(__dirname, 'databases/migrations/')
		},
		seeds: {
			directory: path.resolve(__dirname, 'databases/seeds/')
		},
		log: {
			error: (msg) => console.error(msg),
			warn: (msg) => console.info(msg)
		}
	},
	staging: {
		client: process.env.DB_CLIENT,
		connection: {
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME
		},
		pool: {
			min: 5,
			max: 10
		},
		migrations: {
			directory: path.resolve(__dirname, 'databases/migrations/')
		},
		seeds: {
			directory: path.resolve(__dirname, 'databases/seeds/')
		},
		log: {
			error: (msg) => console.error(msg),
			warn: (msg) => console.info(msg)
		}
	},
	production: {
		client: process.env.DB_CLIENT,
		connection: {
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME
		},
		pool: {
			min: 10,
			max: 20
		},
		migrations: {
			directory: path.resolve(__dirname, 'databases/migrations/')
		},
		seeds: {
			directory: path.resolve(__dirname, 'databases/seeds/')
		},
		log: {
			error: (msg) => console.error(msg),
			warn: (msg) => console.info(msg)
		}
	}
}
