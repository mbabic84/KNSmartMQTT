import React, {
    useEffect, useState
} from 'react';

import {
    Box,
    Card,
    CardContent,
    Typography
} from '@mui/material';

import moment from 'moment';

import useWindowDimensions from '../../utils/WindowDimensions';

import Features from './Features';
import SettingsButton from '../../atoms/SettingsButton';

export default function (props) {
    const device = props.device;
    const features = props.features;
    const {
        height: windowHeight,
        width: windowWidth
    } = useWindowDimensions();

    function lqi() {
        const feature = features.find((feature) => feature.type === 'linkquality' || feature.type === 'rssi');
        if (feature) {
            return feature.value;
        }
    }

    function battery() {
        const batteryFeature = features.find((feature) => feature.type === 'battery');
        const batteryLowFeature = features.find((feature) => feature.type === 'battery_low');

        if (batteryLowFeature) {
            if (batteryLowFeature.value === "false") {
                return 100;
            } else {
                return 25;
            }
        } else if (batteryFeature) {
            return batteryFeature.value;
        }
    }

    function updated() {
        let updated;

        for (const feature of features) {
            if (!updated || updated < feature.updated) {
                updated = feature.updated;
            }
        }

        if (updated) {
            return moment.duration(moment().diff(moment.utc(updated))).humanize();
        }
    }

    function status() {
        const lqiValue = lqi();
        const batteryValue = battery();
        const updatedValue = updated();

        const lqiTypo = () => {
            if (lqiValue) {
                return (
                    <Typography
                        variant='caption'
                        sx={{
                            display: 'flex',
                            flexGrov: 1,
                            padding: 1
                        }}
                    >
                        LQI: {lqiValue}
                    </Typography>
                )
            }
        }

        const batteryTypo = () => {
            if (batteryValue) {
                return (
                    <Typography
                        variant='caption'
                        sx={{
                            display: 'flex',
                            flexGrov: 1,
                            padding: 1
                        }}
                    >
                        BAT: {batteryValue}%
                    </Typography>
                )
            }
        }

        const updatedTypo = () => {
            if (updatedValue) {
                return (
                    <Typography
                        variant='caption'
                        sx={{
                            flexGrow: 2,
                            padding: 1,
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}
                    >
                        Updated {updatedValue} ago
                    </Typography>
                )
            }
        }

        return (
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    width: '100%'
                }}
            >
                {updatedTypo()}
                {lqiTypo()}
                {batteryTypo()}
            </Box>
        )
    }

    function getCardWidth() {
        const minWidth = 400;
        const calculatedWidth = (windowWidth / 3) - 70;

        return calculatedWidth < minWidth ? minWidth : calculatedWidth;
    }

    return (
        <Card
            sx={{
                display: 'flex',
                margin: 1,
                width: `${getCardWidth()}px`
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexGrow: 1,
                    width: '100%'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexGrow: 1,
                        width: '100%'
                    }}
                >
                    <Box>
                        <Typography
                            variant='h6'
                        >
                            {device.key}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end'
                        }}
                    >
                        <SettingsButton
                            onClick={() => props.openSettings()}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        width: '100%',
                        paddingBottom: 1,
                        color: 'grey'
                    }}
                >
                    <Typography
                        variant='caption'
                    >
                        {device.data?.definition?.description}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexGrow: 1
                    }}
                >
                    <Features
                        device={device}
                        features={features}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        width: '100%',
                        alignContent: 'flex-end',
                        justifyContent: 'flex-end',
                        paddingTop: 1,
                        color: 'grey'
                    }}
                >
                    {status()}
                </Box>
            </CardContent>
        </Card>
    )
}