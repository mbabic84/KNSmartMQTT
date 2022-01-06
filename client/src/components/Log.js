import React, {
    useState,
    useContext
} from 'react';
import {
    Accordion,
    AccordionSummary,
    Card,
    Typography,
    Paper
} from '@mui/material';
import moment from 'moment';

import { LogContext } from '../App';

export default function (props) {
    const { log } = useContext(LogContext);
    const [expanded, setExpanded] = useState(true);

    function handleExpand() {
        setExpanded((prevState) => {
            return !prevState;
        })
    }

    function logLines() {
        return log.map((line, index) => {
            return (
                <Typography
                    key={index}
                    variant='caption'
                >
                    [{moment.utc(line.created).local().format("YYYY-MM-DD HH:mm:ss.SSS")}] [{line.type}] {line.message}
                </Typography>
            )
        })
    }

    return (
        <Accordion
            expanded={expanded}
            onClick={handleExpand}
            disableGutters={true}
        >
            <AccordionSummary>
                <Typography variant='h6'>Log</Typography>
            </AccordionSummary>
            <Paper
                sx={{
                    margin: 1,
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    height: '85vh',
                    overflow: 'auto'
                }}
                variant='outlined'
                onClick={(e) => e.stopPropagation()}
            >
                {logLines()}
            </Paper>
        </Accordion>
    )
}