import log from '../utils/log.js';

import pgRules from '../pg/rules.js';
import heater from './heater.js';

let devices = {};
let last = null;
let interval = null;

const HEAT_DELAY = 30 * 1000;
const QUEUE_INTERVAL = 1000;

async function getHeaterRules() {
    return pgRules.get("heater");
}

function add(deviceKey, report) {
    log(`Device ${deviceKey} added to heater control queue!`);
    devices[deviceKey] = {
        report
    };
    last = Date.now();
}

function clear() {
    log(`Heater control queue was cleared!`);
    devices = {};
    last = null;
}

async function heat() {
    if (last && last <= Date.now() - (HEAT_DELAY)) {
        const rules = await getHeaterRules();
        
        for (const rule of rules) {
            if (devices.hasOwnProperty(rule.current.device.key)) {
                devices[rule.current.device.key].rule = rule;
            }
        }

        for (const deviceKey of Object.keys(devices)) {
            if (!devices[deviceKey].hasOwnProperty("rule")) {
                delete devices[deviceKey];
            }
        }

        let device;
        for (const [deviceKey, options] of Object.entries(devices)) {
            const rule = options.rule;
            const dif = rule.setpoint.value - rule.current.value;

            if (!device || device.dif < dif) {
                device = {
                    key: deviceKey,
                    dif,
                    rule
                }
            }
        }

        if (device) {
            await heater.heat(device.key, device.rule);
        }
        
        clear();
    }
}

function init() {
    if (!interval) {
        log(`Heater control queue was initialized!`);

        interval = setInterval(() => {
            heat();
        }, QUEUE_INTERVAL);
    }
}

export default {
    add,
    clear,
    init
}