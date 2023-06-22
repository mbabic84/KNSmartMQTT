import _ from 'lodash';
import PID from 'node-pid-controller';

import Config from '../config/index.js';
import mqtt from '../mqtt/index.js';
import log, { info, warn } from '../utils/log.js';
import pgRules from '../pg/rules.js';

import Constants from '../Constants.js';

let pid = null,
    rules = [],
    devices = {},
    active = null,
    config = null,
    skipNext = false,
    prevTemps = {},
    skip = {},
    lastPidSum = null,
    prevSetpoints = {};

async function activate() {
    active = true;
    config = await Config.get("heater");
}

function deactivate() {
    active = false;
}

function reset() {
    devices = {};
    rules = [];
}

async function reloadRules() {
    rules = await pgRules.get(`heater`);
    rules.forEach((rule) => {
        devices[rule.current.device.key] = {
            report: null,
            rule
        }
    });
}

async function evaluate() {
    let allReported = true;

    for (const [devicekey, { report }] of Object.entries(devices)) {
        if (!report) {
            allReported = false;
        }
    }

    if (allReported) {
        deactivate();

        await reloadRules();
        let selectedDevice
        for (const [deviceKey, { rule }] of Object.entries(devices)) {
            const temperature = Number(rule.current.value);
            const setpoint = Number(rule.setpoint.value);
            const diff = setpoint - temperature;
            const prevTemp = prevTemps[deviceKey];
            const prevSetpoint = prevSetpoints[deviceKey];

            log(`Heater - device check: ${deviceKey}, temperature: ${temperature}, prevTemp: ${prevTemp}, setpoint: ${setpoint}, prevSetpoint: ${prevSetpoint}, diff: ${diff}`);

            if (skip[deviceKey] === undefined && prevSetpoint && Math.abs(prevSetpoint - setpoint) >= config.limit.maxSetpointDiff) {
                skip[deviceKey] = 12;
            }

            if (skip[deviceKey] === undefined && prevTemp && temperature <= prevTemp - config.limit.maxTempDiff) {
                skip[deviceKey] = 6;
            }

            if (skip[deviceKey] >= 1) {
                log(`Heater - skipped: ${deviceKey} ${skip[deviceKey]}`);
                skip[deviceKey] = skip[deviceKey] - 1;
                continue;
            }

            if (!selectedDevice || selectedDevice.diff < diff) {
                selectedDevice = {
                    key: deviceKey,
                    rule,
                    diff
                }
            }

            prevTemps[deviceKey] = Number(rule.current.value);
            prevSetpoints[deviceKey] = Number(rule.setpoint.value);

            delete skip[deviceKey];
        }

        if (selectedDevice) {
            await heat({ deviceKey: selectedDevice.key, rule: selectedDevice.rule });
        }

        reset();
    }
}

async function report({ deviceKey, report }) {
    if (active
        && devices[deviceKey]
        && !devices[deviceKey].report
    ) {
        devices[deviceKey].report = report;
        evaluate();
    }
}

async function init() {
    log(`Heater has been initialized. Waiting for devices to report!`);

    await activate();

    await reloadRules();
}

async function heat({ deviceKey, rule }) {
    if (skipNext) {
        warn("Heating cycle skipped!");
        skipNext = false;
        return;
    }

    config = await Config.get("heater");

    const target = Number(rule.setpoint.value) + (config.offset?.[rule.current.device.type] || 0);
    const input = Number(rule.current.value);
    const type = rule.handler.type;
    const index = rule.handler.key.split("/")[2];
    const pidSum = config.pid.p + config.pid.i + config.pid.d + config.pid.outputMin + config.pid.outputMax;

    if (!pid || lastPidSum != pidSum) {
        pid = new PID({
            k_p: config.pid.p,
            k_i: config.pid.i,
            k_d: config.pid.d
        });
        log(
            `Heater - PID init! P:${config.pid.p} I:${config.pid.i} D:${config.pid.d} Target:${target}`
        );
    }

    pid.setTarget(target);

    let output = pid.update(input);

    if (output >= config.pid.outputMax) {
        skipNext = true;
    }

    lastPidSum = pidSum;

    await Config.set({
        key: "heater",
        data: config
    });

    if (output >= config.limit.min) {
        log("Heater - heating", deviceKey, input, target, output, skipNext);

        const topic = `kn2mqtt/${rule.handler.device.key}/set`;
        const payload = JSON.stringify({
            [type]: {
                [index]: {
                    state: !!(output),
                    duration: output
                }
            }
        });

        await mqtt.publish(
            topic,
            payload
        );

        const diff = Number(target) - Number(input);
        const boostTime = Constants.defaults.mqtt.intervals.get;

        if (diff >= 1) {
            log("Heater - boost", deviceKey, diff, boostTime);
            await mqtt.publish(
                `zigbee2mqtt/${deviceKey}/set`,
                JSON.stringify({
                    boost_timeset_countdown: boostTime
                })
            )
        }
    } else {
        warn("Heater - heating skipped!", deviceKey, input, target, output, skipNext);
    }
}

export default {
    report,
    heat,
    init,
}