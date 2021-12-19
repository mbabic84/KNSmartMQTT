import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function (props) {
    const [value, setValue] = useState(0);
    const nextFeaturesLoad = useRef(null);
    const interval = useRef(null);

    useEffect(() => {
        if (nextFeaturesLoad.current !== props.nextFeaturesLoad) {
            nextFeaturesLoad.current = props.nextFeaturesLoad;

            if (interval.current) {
                clearInterval(interval.current);
            }

            const delay = (props.nextFeaturesLoad - Date.now()) / 100;

            let progress = 0;

            interval.current = setInterval(() => {
                setValue(progress++);
            }, delay)
        }

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        }
    }, [props.nextFeaturesLoad])

    return (
        <Box
            sx={{
                display: 'flex',
                position: 'fixed',
                bottom: 0,
                width: '5rem',
                justifyContent: 'center',
                marginBottom: 2
            }}
        >
            <CircularProgress
                sx={{
                    display: 'flex',
                }}
                color="info"
                size={25}
                value={value}
                variant='determinate'
            />
        </Box>
    )
}