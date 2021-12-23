import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import FeatureSettings from '../FeatureSettings';
import FeatureDetails from '../FeatureDetails';

import SettingsButton from '../../atoms/SettingsButton';
import DetailsButton from '../../atoms/DetailsButton';
import RulesButton from '../../atoms/RulesButton';

import NumericContent from './NumericContent';
import RelayContent from './RelayContent';

import Constants from '../../Constants';

export default function (props) {
    const [settingsActive, setSettingsActive] = useState(false);
    const [detailsActive, setDetailssActive] = useState(false);

    function handleDetailsClick() {
        setDetailssActive(true);
    }

    function handleDetailsClose() {
        setDetailssActive(false);
    }

    function handleSettingsClick() {
        setSettingsActive(!settingsActive);
    }

    function handleSettingsClose() {
        setSettingsActive(false);
    }

    function settings() {
        if (settingsActive) {
            return (
                <FeatureSettings key={props.featureKey} {...props} onClose={handleSettingsClose}
                />
            )
        }
    }

    function details() {
        if (detailsActive) {
            return (
                <FeatureDetails key={props.featureKey} {...props} onClose={handleDetailsClose} />
            )
        }
    }

    function rulesButton() {
        switch(props.type) {
            case "temperature":
            case "pressure":
            case "humidity":
                return (
                    <RulesButton />
                )
        }
    }

    function content() {
        switch (props.type) {
            case "temperature":
            case "humidity":
            case "pressure":
            case "setpoint":
                return (
                    <NumericContent
                        key={props.featureKey}
                        {...props}
                        unit={Constants.units?.type?.[props.type]}
                        decimal
                    />
                )
            case "rssi":
            case "battery":
                return (
                    <NumericContent
                        key={props.featureKey}
                        {...props}
                        unit={Constants.units?.type?.[props.type]}
                    />
                )
            case "relay":
                return (
                    <RelayContent key={props.featureKey} {...props} />
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
                            <Typography variant='h2' sx={{ color: Constants.colors.default.primary }}>
                                {props.value}
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
                    borderColor: Constants.colors.type[props.type]?.primary || Constants.colors.default.primary,
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
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                color: Constants.colors.text.primary
                            }}
                        >
                            {props.config.name || props.featureKey}
                        </Typography>
                        <Typography
                            variant='caption'
                            sx={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                color: Constants.colors.text.secondary
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
                    <DetailsButton onClick={handleDetailsClick} />
                    {rulesButton()}
                    <SettingsButton onClick={handleSettingsClick} />
                </Box>
            </Card>
            {settings()}
            {details()}
        </Box>
    )
}