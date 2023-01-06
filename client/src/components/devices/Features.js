import React, {
    useEffect, useState
} from 'react';

import {
    Box,
    Card,
    CardContent,
    Typography
} from '@mui/material';

import FeaturesZigBeeRadiatorValve from './FeaturesZigBeeRadiatorValve';
import FeaturesZigBeeBulb from './FeaturesZigBeeBulb';
import FeaturesZigBeePlug from './FeaturesZigBeePlug';
import FeaturesNodemcu from './FeaturesNodemcu';

export default function (props) {
    const device = props.device;
    const features = props.features;
    const type = device.type;

    switch (type) {
        case "zbRadiatorValve":
            return (
                <FeaturesZigBeeRadiatorValve
                    device={device}
                    features={features}
                />
            )
        case "zbBulb":
            return (
                <FeaturesZigBeeBulb
                    device={device}
                    features={features}
                />
            )
        case "zbPlug":
        case "zbRelay":
            return (
                <FeaturesZigBeePlug
                    device={device}
                    features={features}
                />
            )
        case "nodemcu":
            return (
                <FeaturesNodemcu
                    device={device}
                    features={features}
                />
            )
    }
}