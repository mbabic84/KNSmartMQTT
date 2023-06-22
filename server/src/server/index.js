import express from 'express';
import http from 'http';

import routes from '../routes/index.js';
import socketio from '../socketio/index.js';
import log from '../utils/log.js';
import intervalControl from '../control/interval.js';
import timerControl from '../control/timer.js';

import config from '../config/server.js';

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || config.port || 9578;

async function listen() {
    await new Promise((resolve) => {
        server.listen(port, async () => {
            log(`Server listening on port ${port}!`);
            resolve();
        });
    })
}

async function init() {
    log("Routes init!");
    await routes.init(app);
    log("SocketIO init!");
    await socketio.init(server);
    log("Interval control init!");
    intervalControl.init();
    log("Timer control init!");
    timerControl.init();
    await listen();
}

export default {
    init
}