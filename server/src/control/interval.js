import moment from 'moment';

import pgRules from "../pg/rules.js";
import mqtt from '../mqtt/index.js';

let rules;

async function loop() {
    const date = new Date();
    const seconds = (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds();

    if (!rules || seconds % 5 === 0) {
        rules = await pgRules.get("interval");
    }

    rules.forEach((rule) => {
        const start = moment.utc(rule.config.start);
        if (start.isBefore(moment.utc()) && seconds % rule.config.interval === 0) {
            if (rule.handler.type === "relay") {
                const index = rule.handler.key.split("/")[2];
                const topic = `kn2mqtt/${rule.handler.device.key}/set`;
                const payload = JSON.stringify({
                    [rule.handler.type]: {
                        [index]: {
                            state: true,
                            duration: rule.config.duration
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
                        state: "ON"
                    })
                );

                setTimeout(() => {
                    mqtt.publish(
                        topic,
                        JSON.stringify({
                            state: "OFF"
                        })
                    );  
                }, rule.config.duration * 1000);
            }
        }
    })
}

function init() {
    setInterval(loop, 1000);
}

export default {
    init
}