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
    emit("feature", feature);
}

function emitLog(log) {
    emit("log", log);
}

function emit(type, payload) {
    if (io) {
        io.to("updates").emit(type, payload);
    }
}

export default {
    init,
    emitFeature,
    emitLog
}