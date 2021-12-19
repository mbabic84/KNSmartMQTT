import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {
    red,
    grey,
    blueGrey,
    lime,
    blue,
    green
} from '@mui/material/colors';
import Typography from '@mui/material/Typography';

import FeatureSettings from '../../components/FeatureSettings';

import FavoriteButton from '../../atoms/FavoriteButton';
import SettingsButton from '../../atoms/SettingsButton';
import ChartButton from '../../atoms/ChartButton';
import InfoButton from '../../atoms/InfoButton';

import TemperatureContent from './TemperatureContent';
import RelayContent from './RelayContent';
import HumidityContent from './HumidityContent';
import PressureContent from './PressureContent';

const TYPE_COLOR = {
    temperature: {
        avatar: red[800]
    },
    relay: {
        avatar: lime[800]
    },
    humidity: {
        avatar: blue[800]
    },
    pressure: {
        avatar: green[800]
    },
    default: blueGrey[800]
}

export default function (props) {
    const [settingsActive, setSettingsActive] = useState(false);

    function handleSettingsClick() {
        setSettingsActive(!settingsActive);
    }

    function handleSettingsClose() {
        setSettingsActive(false);
    }

    function settings() {
        if (settingsActive) {
            return (
                <FeatureSettings
                    {...props}
                    onClose={handleSettingsClose}
                />
            )
        }
    }

    function content() {
        switch (props.type) {
            case "temperature":
                return (
                    <TemperatureContent {...props} />
                )
            case "relay":
                return (
                    <RelayContent {...props} />
                )
            case "humidity":
                return (
                    <HumidityContent {...props} />
                )
            case "pressure":
                return (
                    <PressureContent {...props} />
                )
            default:
                return (
                    <Box sx={{ display: 'flex', flexGrow: 1 }}>
                        <Container
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                margin: 1
                            }}
                        >
                            <Typography variant='h2' sx={{ color: TYPE_COLOR.default }}>
                                ???
                            </Typography>
                        </Container>
                    </Box>
                )
        }
    }

    return (
        <Box>
            <Card
                variant='outlined'
                sx={{
                    margin: 1,
                    width: 300,
                    borderColor: TYPE_COLOR[props.type]?.avatar || TYPE_COLOR.default,
                    display: 'flex'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: 1,
                            width: 240
                        }}
                    >
                        <Typography
                            variant='h6'
                            sx={{
                                color: grey[400],
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {props.config.name || props.featureKey}
                        </Typography>
                        <Typography
                            variant='caption'
                            sx={{
                                color: grey[600],
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {props.config.description || props.type}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        {content()}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 1,
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}
                >
                    <ChartButton
                        onClick={() => { }}
                    />
                    <InfoButton
                        onClick={() => { }}
                    />
                    <SettingsButton
                        onClick={handleSettingsClick}
                    />
                </Box>
            </Card>
            {settings()}
        </Box>
    )
}