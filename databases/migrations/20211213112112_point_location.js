exports.up = async (knex) => {
	await knex.schema.withSchema('public').createTable('point_location', (table) => {
		table.increments('id').primary().unique().index()
		table.integer('driver_id').notNullable()
		table.text('address').notNullable()
		table.string('city').notNullable()
		table.string('state').notNullable()
		table.string('country').notNullable()
		table.bigInteger('postcode').unsigned().notNullable()
		table.float('latitude').notNullable()
		table.float('longitude').notNullable()
		table.boolean('active').notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

exports.down = async (knex) => {
	await knex.schema.withSchema('public').dropTable('point_location')
}
