import React, { useState, useEffect, useRef } from 'react';
import { Alert, Box } from "@mui/material";
import _ from 'lodash';
import PubSub from 'pubsub-js';
import { v4 as uuid } from 'uuid';

import Constants from '../Constants';

const ALERT_TIMEOUT = 5 * 1000;

export default function () {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const alertSubscriberToken = PubSub.subscribe(Constants.pubsub.topics.alert, alertSubscriber);
        return () => {
            PubSub.unsubscribe(alertSubscriberToken);
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (alerts.length) {
                setAlerts((prevAlerts) => {
                    return _.filter(prevAlerts, (alert) => {
                        return !alert.created <= Date.now - ALERT_TIMEOUT;
                    })
                });
            }
        }, ALERT_TIMEOUT);
    }, [alerts])

    function alertSubscriber(topic, data) {
        createAlert(data.type, data.message);
    }

    function createAlert(type, message) {
        const alert = {
            key: uuid(),
            type,
            message,
            created: Date.now()
        }

        setAlerts((prevAlerts) => {
            return [
                ...prevAlerts,
                alert
            ]
        })
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
                        margin: 1,
                        zIndex: 9999
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
                flexWrap: 'wrap',
                zIndex: 999
            }}
        >
            {displayAlerts()}
        </Box>
    )
}