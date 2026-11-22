const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

class GeneratorClient {
  constructor(host = 'localhost:50051') {
    const PROTO_PATH = path.join(__dirname, '../../../proto/generator.proto');
    const packageDef = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
    const proto = grpc.loadPackageDefinition(packageDef).cms.generator;
    this.client = new proto.GeneratorService(host, grpc.credentials.createInsecure());
  }

  sync(entityType, action, entityId, payload = null) {
    return new Promise((resolve, reject) => {
      const req = { entity_type: entityType, action, entity_id: entityId, payload_json: payload ? JSON.stringify(payload) : "" };
      this.client.SyncContent(req, (err, response) => {
        if (err) reject(err); else resolve(response);
      });
    });
  }
}
module.exports = GeneratorClient;