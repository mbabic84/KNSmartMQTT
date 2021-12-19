import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { red } from '@mui/material/colors'

import _ from 'lodash';
import moment from 'moment';

import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line
} from 'recharts';

import FeaturesApi from '../api/Features';

import TemperatureContent from './features/TemperatureContent';

export default function (props) {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        getChartData();
    }, [props.updated])

    async function getChartData() {
        try {
            setChartData(
                await FeaturesApi.getChartData(
                    props.nodeKey,
                    props.type,
                    moment().subtract(24, "hours").format()
                )
            );
        } catch (error) { }
    }

    function getValueUnits() {
        switch (props.type) {
            case "temperature":
                return "℃";
            default:
                return "";
        }
    }

    function customTooltip({ active, payload, label }) {
        if (active && payload && payload.length) {
            return (
                <Card
                    variant='outlined'
                    sx={{
                        padding: 1
                    }}
                >
                    <Typography variant='caption'>
                        {moment(payload[0].payload.time).format("HH:mm")} - {payload[0].value}{getValueUnits()}
                    </Typography>
                </Card>
            );
        } else {
            return null;
        }
    }

    function customXAxisTick({ x, y, stroke, payload }) {
        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={0}
                    textAnchor="middle"
                    fill='#fff'
                    fontSize='11px'
                    fontFamily="monospace"
                >
                    {moment(payload.value).format("HH:mm")}
                </text>
            </g>
        )
    }

    function customYAxisTick({ x, y, stroke, payload }) {
        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={0}
                    textAnchor="middle"
                    fill='#fff'
                    fontSize='12px'
                >
                    {payload.value}
                </text>
            </g>
        )
    }

    function chart() {
        if (chartData.length) {
            return (
                <Card>
                    <ResponsiveContainer height={200}>
                        <LineChart
                            data={chartData}
                            margin={{
                                right: 20,
                                left: 20,
                            }}
                        >
                            <XAxis
                                dataKey='time'
                                hide={false}
                                axisLine={false}
                                tickLine={false}
                                interval='preserveStartEnd'
                                tick={customXAxisTick}
                            />
                            <YAxis
                                dataKey='value'
                                domain={['dataMin - 1', 'dataMax + 1']}
                                hide={true}
                                axisLine={false}
                                tickLine={false}
                                interval='preserveStartEnd'
                                tick={customYAxisTick}
                            />
                            <Tooltip
                                cursor={false}
                                content={customTooltip}
                            />
                            <Line
                                dot={false}
                                dataKey="value"
                                stroke={red[500]}
                                strokeWidth={2}
                                type='monotone'
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            );
        }
    }

    function value() {
        switch (props.type) {
            case "temperature":
                return (
                    <TemperatureContent {...props} />
                )
            default:
                return null;
        }
    }

    return (
        <Backdrop
            open={true}
            sx={{
                zIndex: 1
            }}
            onClick={() => { if (props.onClose) props.onClose(); }}
        >
            <Container
                sx={{
                    bgcolor: '#121212',
                    padding: 3
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant='h3'>
                                {props.config.name}
                            </Typography>
                            <Typography variant='caption'>
                                {props.config.description}
                            </Typography>
                        </Box>
                        <Box>
                            {value()}
                        </Box>
                    </Box>
                    <Box sx={{}}>
                        {chart()}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography variant='subtitle2'>
                                Poslední aktualizace
                            </Typography>
                            <Typography
                                variant='caption'
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                {moment(props.updated).format("HH:mm:ss")}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Backdrop>
    );
}