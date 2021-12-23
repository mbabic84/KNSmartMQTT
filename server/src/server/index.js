import express from 'express';
import http from 'http';

import routes from '../routes/index.js';
import socketio from '../socketio/index.js';

import config from '../config/server.js';

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || config.port || 9578;

async function listen() {
    await new Promise((resolve) => {
        server.listen(port, async () => {
            console.log(`Server listening on port ${port}!`);
            resolve();
        });
    })
}

async function init() {
    await routes.init(app);
    await socketio.init(server);
    await listen();
}

export default {
    init
}