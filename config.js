const Knex = require('knex')
const knexfile = require('./knexfile')

module.exports = Knex.knex([knexfile['development']])
