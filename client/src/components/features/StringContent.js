import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Constants from '../../Constants';

export default function (props) {
    function unit() {
        if (props.unit) {
            return (
                <Typography variant='h6' sx={{ color: Constants.colors?.type?.[props.type]?.secondary || Constants.colors.default.primary }}>
                    {props.unit}
                </Typography>
            )
        }
    }

    function value() {
        return props.value;
    }

    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: 1
                }}
            >
                <Typography variant='h2' sx={{ color: Constants.colors?.type?.[props.type]?.primary || Constants.colors.default.primary }}>
                    {value()}
                </Typography>
                {unit()}
            </Container>
        </Box>
    )
}