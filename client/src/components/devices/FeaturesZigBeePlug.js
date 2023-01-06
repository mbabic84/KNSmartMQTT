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

    function state() {
        const feature = features.find((feature) => feature.type === 'state');
        if (feature) {
            return feature.value;
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
                value={state()}
                title="State"
                valueColor={(value) => value === "ON" ? "green" : "red"}
            />
        </Box>
    )
}