const fs = require('fs').promises;
const path = require('path');

class CompileService {
  constructor() {
    this.contentDir = path.join(__dirname, '../../../servidor-web/content');
  }

  async ensureDirectory() {
    await fs.mkdir(this.contentDir, { recursive: true });
  }

  async sync(entityType, action, entityId, payload) {
    await this.ensureDirectory();
    const filePath = path.join(this.contentDir, `${entityType.toLowerCase()}s.json`);
    
    let data = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }

    if (action === 'DELETE') {
      data = data.filter(item => item.id !== entityId);
    } else if (action === 'UPSERT') {
      const index = data.findIndex(item => item.id === entityId);
      if (index >= 0) data[index] = payload;
      else data.push(payload);
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return new Date().toISOString();
  }
}
module.exports = CompileService;