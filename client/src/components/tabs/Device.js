import React, { useContext, useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Divider,
    Grid
} from '@mui/material';

import CommonDevice from '../devices/Common';
import Settings from '../devices/Settings';

function Device(props) {
    const [settingOverlayDeviceKey, setSettingOverlayDeviceKey] = useState();

    function openSettings(deviceKey) {
        setSettingOverlayDeviceKey(deviceKey);
    }

    function closeSettings() {
        setSettingOverlayDeviceKey();
    }

    function deviceCard(device) {
        return (
            <CommonDevice
                key={device.key}
                device={device}
                features={props.features.filter((feature) => feature.deviceKey === device.key)}
                openSettings={() => openSettings(device.key)}
            />
        );
    }

    function listDevices() {
        return props.devices.map((device) => {
            return deviceCard(device);
        });
    }

    function settingsOverlay() {
        if (settingOverlayDeviceKey) {
            return (
                <Settings
                    deviceKey={settingOverlayDeviceKey}
                    devices={props.devices}
                    features={props.features}
                    closeSettings={() => closeSettings()}
                />
            )
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start'
            }}
        >
            {settingsOverlay()}
            {listDevices()}
        </Box>
    );
}

export default Device;