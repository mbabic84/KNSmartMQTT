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
        battery: "battery",
        linkquality: "rssi",
        local_temperature: "temperature",
        current_heating_setpoint: "setpoint"
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
            allowGet: false,
            intervals: {
                get: 900
            }
        }
    }
}