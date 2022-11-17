import pg from './pg/index.js';
import mqtt from './mqtt/index.js';
import server from './server/index.js';
import heaterQueue from './control/queue.js';

heaterQueue.init();
await pg.init();
await mqtt.init();
await server.init();