import { default as mongo } from './src/mongo.mjs';
import { default as mqtt } from './src/mqtt.mjs';
import { default as api } from './src/api.mjs';

async function start() {
    await mongo.init();
    await mqtt.init();
    await api.init();
}

await start();