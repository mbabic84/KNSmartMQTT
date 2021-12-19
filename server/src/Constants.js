const featureMap = {
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
                    type: `relay${key}`
                };
            })
    },
    battery: "battery",
    linkquality: "rssi",
    local_temperature: "temperature",
    current_heating_setpoint: "target"
}

export default {
    featureMap
}