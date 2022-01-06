import moment from 'moment';

import pgLog from '../pg/log.js';
import socketio from '../socketio/index.js';

function timestamp() {
    return moment().format("YYYY-MM-DD HH:mm:ss.SSS");
}

function formatMessage(...args) {
    return args.join(" ");
}

function format(type, ...args) {
    return `[${timestamp()}] [${type}] ${formatMessage(...args)}`;
}

function logToPg(type, message) {
    return pgLog.set({type, message});
}

export async function error(...args) {
    console.error(format("ERROR", ...args));
    const line = await logToPg("ERROR", formatMessage(...args));
    socketio.emitLog(line);
}

export async function warn(...args) {
    console.warn(format("WARN", ...args));
    const line = await logToPg("WARN", formatMessage(...args));
    socketio.emitLog(line);
}

export async function info(...args) {
    console.info(format("INFO", ...args));
    const line = await logToPg("INFO", formatMessage(...args));
    socketio.emitLog(line);
}

export default async function (...args) {
    console.log(format("LOG", ...args));
    const line = await logToPg("LOG", formatMessage(...args));
    socketio.emitLog(line);
}