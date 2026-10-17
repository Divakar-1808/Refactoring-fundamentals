const db = require('./knex');

async function migrate() {
    // Users table
    await db.schema.hasTable('users').then(async (exists) => {
        if (!exists) {
            await db.schema.createTable('users', (table) => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.string('email').notNullable().unique();
                table.string('status').defaultTo('ACTIVE');
                table.timestamps(true, true);
            });
            console.log('Created table: users');
        }
    });

    // Teams table
    await db.schema.hasTable('teams').then(async (exists) => {
        if (!exists) {
            await db.schema.createTable('teams', (table) => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.integer('ownerId').notNullable().references('id').inTable('users'); // add ownerId
                table.text('members'); // store array as JSON string
                table.timestamps(true, true);
            });
            console.log('Created table: teams');
        }
    });

    // Tasks table
    await db.schema.hasTable('tasks').then(async (exists) => {
        if (!exists) {
            await db.schema.createTable('tasks', (table) => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.text('description');
                table.integer('assignee_id').references('id').inTable('users');
                table.integer('team_id').references('id').inTable('teams');
                table.string('priority').defaultTo('MEDIUM'); // optional: add priority field
                table.string('status').defaultTo('TODO');     // optional: default task status
                table.timestamps(true, true);
            });
            console.log('Created table: tasks');
        }
    });

    console.log('Migration complete.');
    process.exit(0);
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
