exports.up = async (knex) => {
	await knex.raw(`
    DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_type') THEN
          CREATE TYPE location_type AS (
          address VARCHAR(255),
          city VARCHAR(255),
          state VARCHAR(255),
          postcode VARCHAR(255),
          country VARCHAR(255),
          latitude FLOAT,
          longitude FLOAT
        );
      END IF;
    END$$;
  `)

	await knex.raw(`
    DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'destination_type') THEN
          CREATE TYPE destination_type AS (
          address VARCHAR(255),
          city VARCHAR(255),
          state VARCHAR(255),
          postcode VARCHAR(255),
          country VARCHAR(255),
          latitude FLOAT,
          longitude FLOAT
        );
      END IF;
    END$$;
  `)

	await knex.schema.withSchema('public').createTable('order', (table) => {
		table.increments('id').primary().unique().index()
		table.string('no_order').notNullable()
		table.integer('customer_id').notNullable()
		table.integer('driver_id').nullable()
		table.string('name').notNullable()
		table.string('category').notNullable()
		table.bigInteger('price').notNullable()
		table.string('payment_type').notNullable()
		table.text('notes').nullable()
		table.specificType('location', 'location_type').notNullable()
		table.specificType('destination', 'destination_type').notNullable()
		table.enum('status', ['pesanan menunggu konfirmasi', 'pesanan telah diterima', 'pesanan telah selesai']).notNullable()
		table.dateTime('order_date').notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())
	})
}

exports.down = async (knex) => {
	await knex.schema.withSchema('public').dropTable('order')
}
