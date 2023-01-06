import React, {
    useState,
    useEffect,
    useContext
} from 'react';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import _ from 'lodash';
import moment from 'moment';

import {
    ResponsiveContainer,
    LineChart,
    ReferenceLine,
    XAxis,
    YAxis,
    Tooltip,
    Line
} from 'recharts';

import Constants from '../Constants';

import FeaturesApi from '../api/Features';

import NumericContent from './features/NumericContent';
import BatteryContent from './features/BatteryContent';
import StringContent from './features/StringContent';
import RelayContent from './features/RelayContent';

import { RulesContext, FeaturesContext } from '../App';

export default function (props) {
    const [chartData, setChartData] = useState([]);
    const { rules, setRules } = useContext(RulesContext);
    const { features, setFeatures } = useContext(FeaturesContext);
    const [featureRules, setFeatureRules] = useState([]);

    useEffect(() => {
        getChartData();
    }, [props.updated])

    useEffect(() => {
        setFeatureRules(() => {
            return _.filter(rules, (rule) => rule.current === props.featureKey)
        })
    }, [rules])

    async function getChartData() {
        try {
            setChartData(await FeaturesApi.getChartData(
                props.featureKey,
                moment.utc().subtract(24, "hours").format()
            ));
        } catch (error) { }
    }

    function getValueUnits() {
        return Constants.units?.type?.[props.type] || "";
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
                        {moment.utc(payload[0].payload.created).local().format("HH:mm")} - {payload[0].value}{getValueUnits()}
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
                    {moment.utc(payload.value).local().format("HH:mm")}
                </text>
            </g>
        )
    }

    function referenceLines() {
        const lines = [
            <ReferenceLine
                key="value"
                y={Number(props.value)}
                stroke={Constants.colors.charts.reference}
                strokeDasharray="2 2"
            />
        ];

        featureRules.map((rule) => {
            const setpointFeature = _.find(features, (feature) => feature.key === rule.setpoint);
            if (setpointFeature) {
                lines.push(
                    <ReferenceLine
                        key={setpointFeature.key}
                        y={Number(setpointFeature.value)}
                        stroke={Constants.colors.type.setpoint.primary}
                        strokeDasharray="3 3"
                    />
                )
            }
        })

        return lines;
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
            console.log(chartData[0]);
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
                                dataKey='created'
                                hide={false}
                                axisLine={false}
                                tickLine={false}
                                interval='preserveStartEnd'
                                tick={customXAxisTick}
                            />
                            <YAxis
                                dataKey='value'
                                domain={['dataMin - 5', 'dataMax + 5']}
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
                            {referenceLines()}
                            <Line
                                dot={false}
                                dataKey='value'
                                unit={typeof chartData[0].value === "String" ? "String" : "Number"}
                                stroke={Constants.colors.type[props.type].primary || Constants.colors.default.primary}
                                strokeWidth={2}
                                type={props.type === "relay" ? 'linear' : 'monotone'}
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
            case "pressure":
            case "humidity":
            case "local_temperature":
            case "current_heating_setpoint":
                return (
                    <NumericContent
                        unit={Constants.units?.type?.[props.type]}
                        {...props}
                        decimal
                    />
                )
            case "rssi":
                return (
                    <NumericContent
                        {...props}
                    />
                )
            case "battery":
                return (
                    <BatteryContent
                        {...props}
                    />
                )
            case "relay":
            case "state":
                return (
                    <RelayContent
                        {...props}
                    />
                )
            default:
                return (
                    <StringContent
                        {...props}
                    />
                )
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
                    padding: 3,
                    color: Constants.colors.text.primary
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='h3'>
                                {props.config?.name || props.featureKey}
                            </Typography>
                            <Typography variant='caption' sx={{ color: Constants.colors.text.secondary, marginLeft: 2 }}>
                                {props.config?.description || props.type}
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
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography variant='subtitle2' sx={{ color: Constants.colors.text.secondary }}>
                            {props.group?.name}
                        </Typography>
                        <Box
                            sx={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <Typography variant='subtitle2' sx={{ color: Constants.colors.text.secondary }}>
                                Poslední aktualizace
                            </Typography>
                            <Typography
                                variant='caption'
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    color: Constants.colors.text.secondary
                                }}
                            >
                                {moment.utc(props.updated).local().format("HH:mm:ss")}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Backdrop>
    );
}