import Fastify from 'fastify';
import { pino } from 'pino';

import { default as devices } from './devices.mjs';

const logger = pino().child({ action: "fastify-api" });

const fastify = Fastify({ logger });

async function routes() {
    // fastify.get("/devices", (request, replay) => {
    //     replay.send(devices.);
    // });

    // fastify.get("deviceIds", (request, replay) => {
    //     replay.send(get)
    // })
}

export default {
    init: async () => {
        await routes();

        fastify.listen({ port: 4859 }, (error) => {
            if (error) throw error;
        });
    }
}