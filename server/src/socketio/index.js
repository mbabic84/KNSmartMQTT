import { Server } from 'socket.io';

let io;

async function init(server) {
    io = new Server(server, {
        path: '/updates',
        cors: {
            origin: '*',
            methods: ['GET']
        }
    });

    io.on('connection', (socket) => {
        socket.join("updates");
    })
}

async function emitFeature(feature) {
    io.to("updates").emit("feature", feature);
}

export default {
    init,
    emitFeature
}