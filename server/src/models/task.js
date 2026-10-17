const db = require('../db/knex');

module.exports = {
  async create(data) {
    const [id] = await db('tasks').insert(data);
    return { id, ...data };
  },
  
  async findAll() {
    return db('tasks').select('*');
  },
  
  async findById(id) {
    return db('tasks').where({ id }).first();
  },
  
  async update(id, data) {
    await db('tasks').where({ id }).update(data);
    return this.findById(id);
  },
  
  async delete(id) {
    return db('tasks').where({ id }).delete();
  }
};