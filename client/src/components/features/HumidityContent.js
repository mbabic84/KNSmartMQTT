import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { blue, grey } from '@mui/material/colors';
import { Typography } from '@mui/material';

export default function (props) {
    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: 1
                }}
            >
                <Typography variant='h2' sx={{ color: blue[500] }}>
                    {Number(props.value).toFixed(1)}
                </Typography>
                <Typography variant='h6' sx={{ color: grey[600] }}>
                    %
                </Typography>
            </Container>
        </Box>
    )
}