import React, {
    useEffect, useState
} from 'react';

import {
    Box,
    Card,
    CardContent,
    Typography,
    Backdrop,
    CardHeader,
    CardActionArea,
    CardActions
} from '@mui/material';

export default function (props) {
    const devices = props.devices;
    const features = props.features;

    const device = devices.find((device) => device.key === props.deviceKey);
    const deviceFeatures = features.filter((feature) => feature.deviceKey === props.deviceKey);

    console.log(device);
    console.log(deviceFeatures);

    return (
        <Backdrop
            open={true}
            onClick={(e) => {
                e.stopPropagation();
                props.closeSettings();
            }}
            sx={{
                display: 'flex',
                zIndex: '999'
            }}
        >
            <Card
                onClick={(e) => e.stopPropagation()}
                sx={{
                    margin: 1
                }}
            >
                <CardHeader
                    title={device.config.name || device.key}
                    subheader={device.config.description || device.data.definition.description}
                />
                <CardContent>
                    <Box>
                        {JSON.stringify(device.data.definition.exposes, null, 2)}
                    </Box>
                </CardContent>
                <CardActionArea>
                    <CardActions>
                    </CardActions>
                </CardActionArea>
            </Card>
        </Backdrop>
    )
}