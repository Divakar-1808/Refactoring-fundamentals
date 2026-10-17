const db = require('../db/knex');

module.exports = {
  // Create a new team
  async create(data) {
    const [id] = await db('teams').insert(data);
    return { id, ...data };
  },
  
  // Get all teams
  async findAll() {
    return db('teams').select('*');
  },
  
  // Find a team by ID
  async findById(id) {
    return db('teams').where({ id }).first();
  },
  
  // Update a team
  async update(id, data) {
    await db('teams').where({ id }).update(data);
    return this.findById(id);
  },
  
  // Delete a team
  async delete(id) {
    return db('teams').where({ id }).delete();
  }
};