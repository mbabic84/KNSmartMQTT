import { colors } from '@mui/material'

export default {
    pubsub: {
        topics: {
            alert: "alert"
        }
    },
    rules: {
        types: {
            heater: {
                name: "Vytápění",
                description: "Řídí vytápění podle nastavené hodnoty",
                features: [
                    "temperature",
                    "local_temperature"
                ]
            },
            cooler: {
                name: "Chlazení",
                description: "Řídí chlazení jednotky podle nastavené hodnoty",
                features: [
                    "temperature",
                    "local_temperature"
                ]
            },
            fan: {
                name: "Ventilace",
                description: "Řídí ventilaci podle nastavené hodnoty",
                features: [
                    "temperature",
                    "local_temperature",
                    "humidity"
                ]
            },
            timer: {
                name: "Časovač",
                description: "Spíná podle nastaveného času",
                features: [
                    "relay",
                    "state"
                ]
            },
            interval: {
                name: "Intervalový časovač",
                description: "Spíná podle nastaveného času a intervalu",
                features: [
                    "relay",
                    "state"
                ]
            }
        }
    },
    units: {
        type: {
            temperature: '°C',
            local_temperature: '°C',
            current_heating_setpoint: '°C',
            setpoint: '°C',
            humidity: '%',
            pressure: 'hPa'
        }
    },
    colors: {
        type: {
            temperature: {
                primary: colors.red[800],
                secondary: colors.grey[800]
            },
            local_temperature: {
                primary: colors.red[800],
                secondary: colors.grey[800]
            },
            setpoint: {
                primary: colors.lightGreen[800],
                secondary: colors.grey[800]
            },
            current_heating_setpoint: {
                primary: colors.lightGreen[800],
                secondary: colors.grey[800]
            },
            relay: {
                main: colors.lime[800],
                secondary: colors.grey[800]
            },
            humidity: {
                primary: colors.blue[800],
                secondary: colors.grey[800]
            },
            pressure: {
                primary: colors.green[800],
                secondary: colors.grey[800]
            },
            battery: {
                primary: colors.brown[400],
                secondary: colors.grey[800]
            },
            battery_low: {
                primary: colors.brown[400],
                secondary: colors.grey[800]
            },
            rssi: {
                primary: colors.deepOrange[800],
                secondary: colors.grey[800]
            },
            linkquality: {
                primary: colors.deepOrange[800],
                secondary: colors.grey[800]
            },
            state: {
                main: colors.lime[800],
                secondary: colors.grey[800]
            },
        },
        text: {
            primary: colors.blueGrey[100],
            secondary: colors.blueGrey[200]
        },
        default: {
            primary: colors.blueGrey[800],
            secondary: colors.grey[800]
        },
        charts: {
            reference: colors.blueGrey[200]
        },
        select: {
            primary: colors.grey[100],
            secondary: colors.grey[500]
        }
    }
}