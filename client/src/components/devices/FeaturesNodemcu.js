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

    const temperature = () => {
        const feature = features.find((feature) => feature.type === 'temperature');
        if (feature) {
            return Number(feature.value).toFixed(1);
        }
    }

    const humidity = () => {
        const feature = features.find((feature) => feature.type === 'humidity');
        if (feature) {
            return Number(feature.value).toFixed(1);
        }
    }

    const pressure = () => {
        const feature = features.find((feature) => feature.type === 'pressure');
        if (feature) {
            return Number(feature.value).toFixed(1);
        }
    }

    const state_1 = () => {
        const feature = features.find((feature) => feature.type === 'relay' && feature.key.endsWith('0'));
        if (feature) {
            return feature.value === "1" ? "ON" : "OFF";
        }
    }

    const state_2 = () => {
        const feature = features.find((feature) => feature.type === 'relay' && feature.key.endsWith('1'));
        if (feature) {
            return feature.value === "1" ? "ON" : "OFF";
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexGrow: 1,
                flexWrap: 'wrap',
                margin: 2,
                width: '100%',
                justifyContent: 'space-evenly'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexGrow: 1,
                    width: '100%',
                    justifyContent: 'space-evenly'
                }}
            >
                <FeatureValue
                    title="Temperature"
                    valueColor="red"
                    value={temperature()}
                    units="&deg;C"
                />
                <FeatureValue
                    title="Humidity"
                    valueColor="blue"
                    value={humidity()}
                    units="%"
                />
                <FeatureValue
                    title="Pressure"
                    valueColor="green"
                    value={pressure()}
                    units="hPa"
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    width: '100%',
                    justifyContent: 'space-evenly'
                }}
            >
                <FeatureValue
                    title="State 1"
                    valueColor={(value) => value === "ON" ? 'green' : 'red'}
                    value={state_1()}
                />
                <FeatureValue
                    title="State 2"
                    valueColor={(value) => value === "ON" ? 'green' : 'red'}
                    value={state_2()}
                />
            </Box>
        </Box>
    )
}