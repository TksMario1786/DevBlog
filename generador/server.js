const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const CompileService = require('./src/services/CompileService');

const PROTO_PATH = path.join(__dirname, '../proto/generator.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
const proto = grpc.loadPackageDefinition(packageDef).cms.generator;

const compileService = new CompileService();

const server = new grpc.Server();
server.addService(proto.GeneratorService.service, {
  SyncContent: async (call, callback) => {
    try {
      const { entity_type, action, entity_id, payload_json } = call.request;
      const payload = payload_json ? JSON.parse(payload_json) : null;
      const compiledAt = await compileService.sync(entity_type, action, entity_id, payload);
      
      callback(null, { success: true, message: 'OK', compiled_at: compiledAt });
    } catch (error) {
      callback({ code: grpc.status.INTERNAL, details: error.message });
    }
  }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('[Generador gRPC] Escuchando en puerto 50051');
});