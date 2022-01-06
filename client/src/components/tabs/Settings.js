import React from 'react';
import { Box } from '@mui/material';

import Log from '../Log';

function Settings(props) {
    return (
        <Box
            sx={{
                display: props.activeTab === props.index ? 'flex' : 'none',
                flexDirection: 'column',
                gap: 1
            }}
        >
            <Log />
        </Box>
    )
}

export default Settings;