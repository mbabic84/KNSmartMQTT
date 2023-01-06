import React, {
    useEffect, useState
} from 'react';

import {
    Box,
    Card,
    CardContent,
    Typography
} from '@mui/material';

import FeatureValue from './atoms/FeatureValue';

export default function (props) {
    const features = props.features;

    function temperature() {
        const feature = features.find((feature) => feature.type === 'local_temperature');
        if (feature) {
            return Number(feature.value).toFixed(1);
        }
    }

    function setpoint() {
        const feature = features.find((feature) => feature.type === 'current_heating_setpoint');
        if (feature) {
            return Number(feature.value).toFixed(1);
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexGrow: 1,
                flexWrap: 'wrap',
                margin: 2,
                justifyContent: 'space-evenly'
            }}
        >
            <FeatureValue
                value={temperature()}
                units="&deg;C"
                valueColor="red"
            />
            <FeatureValue
                value={setpoint()}
                units="&deg;C"
                valueColor="green"
            />
        </Box>
    )
}