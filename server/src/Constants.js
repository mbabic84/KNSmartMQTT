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
                zbtrv: 0
            },
            limit: {
                min: 30
            },
            pid: {
                p: 0,
                i: 0,
                d: 0,
                target: 0,
                sampleTime: 1,
                outputMin: 0,
                outputMax: 0,
            }
        },
        mqtt: {
            allowGet: true,
            intervals: {
                get: 1200
            }
        }
    }
}