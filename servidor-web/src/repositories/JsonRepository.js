const fs = require('fs').promises;
const path = require('path');

class JsonRepository {
  constructor(filename) {
    this.filePath = path.join(__dirname, '../../content', filename);
  }
  async findAll() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }
  }
}
module.exports = JsonRepository;