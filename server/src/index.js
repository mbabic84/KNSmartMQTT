import consoleStamp from 'console-stamp';

import pg from './pg/index.js';
import mqtt from './mqtt/index.js';
import server from './server/index.js';

consoleStamp(
    console,
    {
        format: ':date(yyyy-mm-dd HH:MM:ss) :label'
    }
);

await pg.init();
await mqtt.init();
await server.init();