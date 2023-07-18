import { MongoClient } from 'mongodb';

import { default as log } from './logger.mjs';

import { default as config } from '../config.mjs';

const mongoClient = new MongoClient(config.mongodb.url);

const DB = "zigbee-bind";
const COLLECTIONS = {
    DEVICES: "devices",
    BINDS: "binds",
    METRICS: "metrics"
}

const action = "mongo";

async function openConnection() {
    await mongoClient.connect();
}

async function ensureCollections() {
    await ensureDevicesCollection();
    await ensureBindsCollection();
    await ensureMetricsCollection();
}

async function ensureDevicesCollection() {
    await mongoClient
        .db(DB)
        .createCollection(COLLECTIONS.DEVICES)
        .catch((e) => log({ action, error: e.message }));
}

async function ensureBindsCollection() {
    await mongoClient
        .db(DB)
        .createCollection(COLLECTIONS.BINDS)
        .catch((e) => log({ action, error: e.message }));

    await mongoClient
        .db(DB)
        .collection(COLLECTIONS.BINDS)
        .createIndex({ ieee_address: 1 })
        .catch((e) => log({ action, error: e.message }));
}

async function ensureMetricsCollection() {
    await mongoClient
        .db(DB)
        .createCollection(COLLECTIONS.METRICS)
        .catch((e) => log({ action, error: e.message }));
}

async function ensureStructures() {
    await openConnection();
    await ensureCollections();
}

export default {
    init: async () => {
        await ensureStructures();
    },
    devices: {
        add: async (device) => {
            return await mongoClient
                .db(DB)
                .collection(COLLECTIONS.DEVICES)
                .updateOne({ ieee_address: device.ieee_address }, { $set: device }, { upsert: true })
                .catch((e) => log({ action, error: e.message }));
        },
        get: async (ieee_address) => {
            return await mongoClient
                .db(DB)
                .collection(COLLECTIONS.DEVICES)
                .findOne({ ieee_address })
                .catch((e) => log({ action, error: e.message }));
        },
        getAll: async () => {
            return await mongoClient
                .db(DB)
                .collection(COLLECTIONS.DEVICES)
                .find({})
                .toArray();
        }
    }
}