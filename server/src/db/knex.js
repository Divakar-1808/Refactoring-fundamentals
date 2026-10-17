const knex = require('knex');
const path = require('path');
const fs = require('fs');

const localDbPath = path.join(__dirname, '..', 'database', 'task_management.db');

// Create database folder if not exists
const dbDir = path.dirname(localDbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: localDbPath,
    },
    useNullAsDefault: true, // Required for SQLite
});

module.exports = db;
