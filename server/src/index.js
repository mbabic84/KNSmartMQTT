import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import pg from './pg/index.js';
import mqtt from './mqtt/index.js';

import config from './config/index.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || config.port || 9578;

await pg.init();
await mqtt.init();

server.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});