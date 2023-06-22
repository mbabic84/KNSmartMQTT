import pg from './pg/index.js';
import mqtt from './mqtt/index.js';
import server from './server/index.js';
import log from './utils/log.js';

log("Database init!")
await pg.init();

log("MQTT init!")
await mqtt.init();

log("Server init!")
await server.init();