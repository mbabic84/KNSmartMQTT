import MQTT from 'mqtt';

async function connect(config) {
    const client = MQTT.connect(config);
    return new Promise((resolve) => {
        client.on('connect', () => {
            resolve(client);
        })
    })
}

async function subscribe(topic, client) {
    return new Promise((resolve, reject) => {
        client.subscribe(topic, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

async function publish(topic, message, client) {
    return new Promise((resolve, reject) => {
        client.publish(topic, message, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        })
    })
}

export default {
    connect,
    subscribe,
    publish
}