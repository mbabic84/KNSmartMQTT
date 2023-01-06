import pg from './pg/index.js';
import mqtt from './mqtt/index.js';
import server from './server/index.js';

await pg.init();
await mqtt.init();
await server.init();