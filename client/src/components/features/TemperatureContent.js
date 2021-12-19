import React from 'react';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { red, grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';

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
                <Typography variant='h2' sx={{ color: red[500] }}>
                    {Number(props.value).toFixed(1)}
                </Typography>
                <Typography variant='h6' sx={{ color: grey[600] }}>
                    °C
                </Typography>
            </Container>
        </Box>
    )
}