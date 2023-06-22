export default {
    featureMap: {
        temperature: "temperature",
        humidity: "humidity",
        pressure: "pressure",
        rssi: "rssi",
        relay: (value) => {
            return Object
                .keys(value)
                .map((key) => {
                    return {
                        key,
                        type: 'relay',
                        index: key,
                        value: (value) => Number(value)
                    };
                })
        },
        battery_low: {
            type: "battery",
            transform: (value) => {
                return value ? 0 : 1;
            }
        },
        linkquality: "rssi",
        local_temperature: "temperature",
        current_heating_setpoint: "setpoint",
        state: {
            type: "state",
            transform: (value) => {
                return value === "ON" ? 1 : 0;
            }
        },
        brightness: "brightness",
        color_temp: "colorTemperature"
    },
    defaults: {
        heater: {
            offset: {
                zbRadiatorValve: -0.5
            },
            limit: {
                min: 30,
                maxTempDiff: 0.75,
                maxSetpointDiff: 2
            },
            pid: {
                p: 100,
                i: 0.01,
                d: 0.01,
                outputMin: 0,
                outputMax: 600,
            }
        },
        mqtt: {
            allowGet: true,
            intervals: {
                get: 600
            }
        }
    }
}