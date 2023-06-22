import { default as config } from './config.mjs';

export function getBind(topic, payload) {
    return config.binds.find((bind) => {
        if (bind.source.topic === topic) {
            let match = true;

            for (const [payloadKey, payloadValue] of Object.entries(bind.source.payload)) {
                if (!payload[payloadKey] || payload[payloadKey] !== payloadValue) {
                    match = false;
                }
            }

            if (match) {
                return bind;
            }
        }
    })
}

export function getPayload(bind) {
    let payloadToSend = {};
    
    for (const [key, value] of Object.entries(bind.destination.payload)) {
        if (typeof value === "function") {
            payloadToSend[key] = value();
        } else {
            payloadToSend[key] = value;
        }
    }

    return JSON.stringify(payloadToSend);
}