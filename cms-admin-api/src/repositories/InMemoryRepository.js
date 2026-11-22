class InMemoryRepository {
  constructor() { this.data = new Map(); }
  findAll() { return Array.from(this.data.values()); }
  findById(id) { return this.data.get(id); }
  save(entity) { this.data.set(entity.id, entity); return entity; }
  delete(id) { return this.data.delete(id); }
}
module.exports = InMemoryRepository;