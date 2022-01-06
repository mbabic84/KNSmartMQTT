import React, {
    useContext,
    useState,
} from 'react';
import {
    Box,
    Select,
    MenuItem,
    FormControl,
    Typography,
    TextField,
    FormControlLabel,
    RadioGroup,
    Radio
} from '@mui/material';

import { FeaturesContext } from '../App';

import Constants from '../Constants';
import isValidJson from '../utils/IsValidJson';

export default function (props) {
    const { features, setFeatures } = useContext(FeaturesContext);
    const [configError, setConfigError] = useState(false);
    const [config, setConfig] = useState(props.config ? JSON.stringify(props.config, null, 2) : "{}");

    function setPointItems(ruleKey) {
        return features
            .filter((feature) => feature.type === "setpoint")
            .map((feature) => {
                return (
                    <MenuItem key={`${ruleKey}#${feature.key}`} value={feature.key}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            color: Constants.colors.select.primary
                        }}>
                            <Typography variant='subtitle2'>
                                {feature.config.name || feature.key}
                            </Typography>
                            <Typography variant='caption'>
                                {feature.config.description || feature.type} - {feature.key}
                            </Typography>
                        </Box>
                    </MenuItem>
                )
            })
    }

    function handlerItems(ruleKey) {
        return features
            .filter((feature) => feature.type === "relay")
            .map((feature) => {
                return (
                    <MenuItem key={`${ruleKey}#${feature.key}`} value={feature.key}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            color: Constants.colors.select.primary
                        }}>
                            <Typography variant='subtitle2'>
                                {feature.config.name || feature.key}
                            </Typography>
                            <Typography variant='caption'>
                                {feature.config.description || feature.type} - {feature.key}
                            </Typography>
                        </Box>
                    </MenuItem>
                )
            })
    }

    function onChange(event) {
        props.onChange(props.ruleKey, event.target.name, event.target.value);
    }

    function onConfigChange(event) {
        const value = event.target.value;
        setConfig(value);

        if (isValidJson(value)) {
            props.onChange(props.ruleKey, event.target.name, JSON.parse(value));
            setConfigError(false);
        } else {
            setConfigError(true);
        }
    }

    function onActiveChange(event) {
        const value = event.target.value;
        const valueBool = value === "1" ? true : false;
        props.onChange(props.ruleKey, event.target.name, valueBool);
    }

    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <FormControl>
                <Select
                    value={props.setpoint || ""}
                    displayEmpty
                    name="setpoint"
                    onChange={onChange}
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ display: 'flex', flexGrow: 1 }}
                >
                    <MenuItem value="">
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            color: Constants.colors.select.secondary
                        }}>
                            <Typography variant='subtitle2'>
                                Cílová teplota
                            </Typography>
                            <Typography variant='caption'>
                                Cílovou teplotu vytápění bude určovat vybraný prvek
                            </Typography>
                        </Box>
                    </MenuItem>
                    {setPointItems(props.ruleKey)}
                </Select>
            </FormControl>
            <FormControl>
                <Select
                    value={props.handler || ""}
                    displayEmpty
                    name="handler"
                    onChange={onChange}
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ display: 'flex', flexGrow: 1 }}
                >
                    <MenuItem value="">
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            color: Constants.colors.select.secondary
                        }}>
                            <Typography variant='subtitle2'>
                                Spínač kotle
                            </Typography>
                            <Typography variant='caption'>
                                Kotel bude ovládán vybraným prvkem
                            </Typography>
                        </Box>
                    </MenuItem>
                    {handlerItems(props.ruleKey)}
                </Select>
            </FormControl>
            <FormControl>
                <TextField
                    label="Konfigurace"
                    name="config"
                    multiline
                    minRows={4}
                    error={configError}
                    value={config}
                    onChange={onConfigChange}
                    sx={{ display: 'flex', flexGrow: 1, borderColor: '#000' }}
                />
            </FormControl>
            <FormControl>
                <RadioGroup
                    value={String(!props.active || props.active === null ? 0 : 1)}
                    name="active"
                    onChange={onActiveChange}
                >
                    <Box
                        sx={{ display: 'flex', justifyContent: 'space-around' }}
                    >
                        <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Zapnuto"
                        />
                        <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="Vypnuto"
                        />
                    </Box>
                </RadioGroup>
            </FormControl>
        </Box>
    )
}