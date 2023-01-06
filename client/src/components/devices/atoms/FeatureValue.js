import React from "react";
import {
    Box,
    Typography
} from "@mui/material";

export default function (props) {
    const valueColor = () => {
        if (typeof props.valueColor === "function") {
            return props.valueColor(props.value);
        } else {
            return props.valueColor || 'grey';
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                margin: 1,
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1
                }}
            >
                <Typography
                    variant='caption'
                    sx={{
                        color: 'grey'
                    }}
                >
                    {props.title}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    paddingLeft: 1
                }}
            >
                <Box
                    sx={{
                        display: 'flex'
                    }}
                >
                    <Typography
                        variant='h2'
                        sx={{
                            color: valueColor()
                        }}
                    >
                        {props.value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex'
                    }}
                >
                    <Typography
                        variant='caption'
                        sx={{
                            color: 'grey'
                        }}
                    >
                        {props.units}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}