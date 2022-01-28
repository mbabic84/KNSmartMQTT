import React from 'react';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import { green, red } from '@mui/material/colors';
import Box from '@mui/material/Box';

const indicatorSize = 72;

export default function (props) {
    console.log(props.value);
    function state() {
        if (props.value === "false" || props.value === "100") {
            return (
                <Avatar
                    sx={{
                        bgcolor: green[800],
                        width: indicatorSize,
                        height: indicatorSize
                    }}>
                    OK
                </Avatar>
            )
        } else {
            return (
                <Avatar
                    sx={{
                        bgcolor: red[800],
                        width: indicatorSize,
                        height: indicatorSize
                    }}>
                    LOW
                </Avatar>
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