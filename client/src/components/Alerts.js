import React, { useContext, useEffect } from 'react';
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import _ from 'lodash';

import { AlertsContext } from '../App';

const ALERT_TIMEOUT = 5 * 1000;

export default function () {
    const { alerts, setAlerts } = useContext(AlertsContext);

    useEffect(() => {
        let interval = setInterval(() => {
            clearAlerts();
        }, 1000);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [alerts])

    function clearAlerts() {
        setAlerts(_.filter(alerts, (alert) => {
            return Date.now() - alert.created < ALERT_TIMEOUT;
        }));
    }

    function handleOnClose(key) {
        setAlerts(_.filter(alerts, (alert) => {
            return alert.key !== key;
        }));
    }

    function displayAlerts() {
        return alerts.map((alert) => {
            return (
                <Alert
                    key={alert.key}
                    severity={alert.type}
                    variant='filled'
                    sx={{
                        margin: 1
                    }}
                    onClose={() => handleOnClose(alert.key)}
                >
                    {alert.message}
                </Alert>
            )
        });
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap'
            }}
        >
            {displayAlerts()}
        </Box>
    )
}