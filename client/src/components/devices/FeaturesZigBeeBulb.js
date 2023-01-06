import React, {
    useEffect, useState
} from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import ColorScale from 'color-scales';

const tempColorScale = new ColorScale(153, 370, ['#3366ff', '#cccc00']);

import FeatureValue from './atoms/FeatureValue';

export default function (props) {
    const features = props.features;

    function state() {
        const feature = features.find((feature) => feature.type === 'state');
        if (feature) {
            return feature.value;
        }
    }

    function brightness() {
        const feature = features.find((feature) => feature.type === 'brightness');
        if (feature) {
            const value = Number(feature.value);
            const r1 = [0, 254];
            const r2 = [0, 100];
            return Math.round((value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0]);
        }
    }

    function color() {
        const feature = features.find((feature) => feature.type === 'color_temp');
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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-evenly'
                    }}
                >
                    <FeatureValue
                        value={state()}
                        title="State"
                        valueColor={(value) => value === "ON" ? 'green' : 'red'}
                    />
                    <FeatureValue
                        value={brightness()}
                        title="Brightness"
                        units="%"
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-evenly'
                    }}
                >
                    <FeatureValue
                        value={color()}
                        title="Color"
                        valueColor={tempColorScale.getColor(Number(color())).toHexString()}
                    />
                </Box>
            </Box>
        </Box>
    )
}