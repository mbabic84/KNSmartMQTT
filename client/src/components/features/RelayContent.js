import React from 'react';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import { green, red } from '@mui/material/colors';
import Box from '@mui/material/Box';

const indicatorSize = 72;

export default function (props) {
    function state() {
        if (props.value === "1") {
            return (
                <Avatar sx={{
                    bgcolor: green[800],
                    width: indicatorSize,
                    height: indicatorSize,
                    cursor: 'pointer'
                }}>ON</Avatar>
            )
        } else {
            return (
                <Avatar sx={{
                    bgcolor: red[800],
                    width: indicatorSize,
                    height: indicatorSize,
                    cursor: 'pointer'
                }}>OFF</Avatar>
            )
        }
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
                {state()}
            </Container>
        </Box>
    )
}