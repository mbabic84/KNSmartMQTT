import _ from 'lodash';
import { PIDController } from '@mariusrumpf/pid-controller';

import Config from '../config/index.js';
import mqtt from '../mqtt/index.js';
import log from '../utils/log.js';
import { warn } from '../utils/log.js';

import Constants from "../Constants.js";

const pid = new PIDController(Constants.defaults.heater.pid);
let lastPidUpdate;
let locked;

async function heat(deviceKey, rule) {
    if (locked) {
        warn(`Device ${deviceKey} was skipped. Heating process already locked!`);
        return;
    }

    if (!rule || rule.current.device.key !== deviceKey) {
        warn(`Device ${deviceKey} was skipped. No rules!`);
        return;
    }

    const defaults = await Config.get("heater");
    const rewrites = rule.config;
    const config = _.merge(defaults, rewrites);

    locked = true;

    const target = Number(rule.setpoint.value) + (Constants.defaults.heater.offset?.[rule.current.device.type] || 0);
    const input = Number(rule.current.value);
    const type = rule.handler.type;
    const index = rule.handler.key.split("/")[2];
    const sampleTime = lastPidUpdate ? Date.now() - lastPidUpdate : 1;

    pid.setTunings(config.pid.p, config.pid.i, config.pid.d);
    pid.setSampleTime(sampleTime);
    pid.setOutputLimits(config.pid.outputMin, config.pid.outputMax);
    pid.setTarget(target);

    const output = pid.update(input);

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

    log(deviceKey, input, target, output, sampleTime);

    if (output < config.limit.min) {
        locked = false;
        return;
    }

    await mqtt.publish(
        topic,
        payload
    );

    setTimeout(() => {
        locked = false;
    }, output * 1000);
}

export default {
    heat
}