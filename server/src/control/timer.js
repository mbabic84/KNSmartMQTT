import moment from 'moment';

import pgRules from "../pg/rules.js";
import mqtt from '../mqtt/index.js';

let rules;
let activeTimers = {};
let expiredTimers = {};

async function loop() {
    const date = new Date();
    const seconds = (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds();

    if (!rules || seconds % 5 === 0) {
        rules = await pgRules.get("timer");
    }

    let nextTimerState = {};
    rules.forEach((rule) => {
        const start = moment.utc(rule.config.start, "HH:mm:ss");
        const end = moment.utc(rule.config.end, "HH:mm:ss");

        if (
            moment().utc().isBetween(start, end, undefined, '[]')
        ) {
            nextTimerState[rule.handler.key] = {
                active: true,
                rule
            }
        } else {
            if (
                !nextTimerState[rule.handler.key]
                || moment.utc(nextTimerState[rule.handler.key].rule.config.end, "HH:mm:ss").isBefore(start)
            ) {
                nextTimerState[rule.handler.key] = {
                    active: false,
                    rule
                }
            }
        }
    })

    let stillActiveTimers = [];
    for (const [key, { active, rule }] of Object.entries(nextTimerState)) {
        if (active) {
            if (!activeTimers[key]) {
                turnOn(rule);
            }
            activeTimers[key] = rule;
            stillActiveTimers.push(key);
            delete expiredTimers[key];
        } else {
            if (!expiredTimers[key]) {
                turnOff(rule);
            }
            expiredTimers[key] = rule;
            delete activeTimers[key];
        }
    }

    for (const [key, rule] of Object.entries(activeTimers)) {
        if (!stillActiveTimers.includes(key)) {
            turnOff(rule);
            delete activeTimers[key];
        }
    }
}

function turnOn(rule) {
    return changeState(true, rule);
}

function turnOff(rule) {
    return changeState(false, rule);
}

function changeState(state, rule) {
    if (rule.handler.type === "relay") {
        const index = rule.handler.key.split("/")[2];
        const topic = `kn2mqtt/${rule.handler.device.key}/set`;
        const payload = JSON.stringify({
            [rule.handler.type]: {
                [index]: {
                    state
                }
            }
        });

        mqtt.publish(
            topic,
            payload
        );
    } else if (rule.handler.type === "state") {
        const topic = `zigbee2mqtt/${rule.handler.device.key}/set`;

        mqtt.publish(
            topic,
            JSON.stringify({
                state: state ? "ON" : "OFF"
            })
        );
    }
}

function init() {
    setInterval(loop, 1000);
}

export default {
    init
}