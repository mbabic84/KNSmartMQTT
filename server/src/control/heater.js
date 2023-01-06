import _ from 'lodash';
import { PIDController } from '@mariusrumpf/pid-controller';

import Config from '../config/index.js';
import mqtt from '../mqtt/index.js';
import log, { info, warn } from '../utils/log.js';
import pgRules from '../pg/rules.js';

import Constants from '../Constants.js';

let pid = null,
    lastPidUpdate = null,
    rules = [],
    devices = {},
    active = null,
    config = null,
    skipNext = false;

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
            const diff = Number(rule.setpoint.value) - Number(rule.current.value);
            log(`Heater - device check: ${deviceKey}, temperature: ${rule.current.value}, setpoint: ${rule.setpoint.value}, diff: ${diff}`);
            if (!selectedDevice || selectedDevice.diff < diff) {
                selectedDevice = {
                    key: deviceKey,
                    rule,
                    diff
                }
            }
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
    const sampleTime = lastPidUpdate ? Date.now() - lastPidUpdate : 1;

    if (!pid) {
        pid = new PIDController({
            p: config.pid.p,
            i: config.pid.i,
            d: config.pid.d,
            target,
            sampleTime,
            outputMin: config.pid.outputMin,
            outputMax: config.pid.outputMax
        });

        log(
            `Heater - PID init! P:${config.pid.p} I:${config.pid.i} D:${config.pid.d} Target:${target} Sample:${sampleTime} Min:${config.pid.outputMin} Max:${config.pid.outputMax}`
        );
    } else {
        pid.setTunings(config.pid.p, config.pid.i, config.pid.d);
        pid.setSampleTime(sampleTime);
        pid.setOutputLimits(config.pid.outputMin, config.pid.outputMax);
        pid.setTarget(target);

        log(
            `Heater - PID update! P:${config.pid.p} I:${config.pid.i} D:${config.pid.d} Target:${target} Sample:${sampleTime} Min:${config.pid.outputMin} Max:${config.pid.outputMax}`
        );
    }

    let output = pid.update(input);
    if (output === config.pid.outputMax) {
        skipNext = true;
    }

    lastPidUpdate = Date.now();

    const topic = `kn2mqtt/${rule.handler.device.key}/set`;
    const payload = JSON.stringify({
        [type]: {
            [index]: {
                state: !!(output),
                duration: output
            }
        }
    });

    await Config.set({
        key: "heater",
        data: config
    });

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

    if (output >= config.limit.min) {
        log("Heater - heating", deviceKey, input, target, output, skipNext, sampleTime);
        await mqtt.publish(
            topic,
            payload
        );
    } else {
        warn("Heater - heating skipped!", deviceKey, input, target, output, skipNext, sampleTime);
    }
}

export default {
    report,
    heat,
    init,
}