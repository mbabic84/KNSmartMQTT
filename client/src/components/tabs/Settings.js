import React from 'react';
import Box from '@mui/material/Box';

function Settings(props) {
    return (
        <Box
            sx={{
                display: props.activeTab === props.index ? 'flex' : 'none',
                flexWrap: 'wrap'
            }}
        >
        </Box>
    )
}

export default Settings;