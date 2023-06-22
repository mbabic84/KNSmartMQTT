import { cycle } from "./utils.mjs"

export default {
    mqtt: {
        uri: "mqtt://10.0.0.113",
        topics: {
            devices: "zigbee2mqtt/bridge/devices"
        }
    },
    binds: [
        {
            source: {
                topic: `zigbee2mqtt/0x60a423fffe8038e0`,
                payload: {
                    action: `1_single`
                },
            },
            destination: {
                topic: `zigbee2mqtt/Lampicka - loznice - pracovni stul/set`,
                payload: {
                    state: () => cycle(1, ["on", "off"])
                }
            }
        }
    ]
}