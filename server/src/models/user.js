const db = require('../db/knex');

module.exports = {
    async create(data) {
        const [id] = await db('users').insert(data);
        return { id, ...data };
    },
    
    async findAll() {
        return db('users').select('*');
    },
    
    async findById(id) {
        return db('users').where({ id }).first();
    },
    
    async findByEmail(email) {
        return db('users').where({ email }).first();
    },
    
    async update(id, data) {
        await db('users').where({ id }).update(data);
        return this.findById(id);
    },
    
    async delete(id) {
        return db('users').where({ id }).delete();
    }
};