import React, {
    useContext,
    useState,
    useEffect
} from 'react';
import {
    Box,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField
} from '@mui/material';
import AdapterMoment from '@mui/lab/AdapterMoment';
import {
    LocalizationProvider,
    MobileTimePicker
} from '@mui/lab';
import moment from 'moment';

import { FeaturesContext } from '../App';

import Constants from '../Constants';

export default function (props) {
    const { features, setFeatures } = useContext(FeaturesContext);
    const [config, setConfig] = useState({
        start: props.config?.start || moment.utc().format(),
        end: props.config?.end || moment.utc().add(5, "minute").format()
    });

    useEffect(() => {
        props.onChange(props.ruleKey, "config", config);
    }, [config]);

    function onActiveChange(event) {
        const value = event.target.value;
        const valueBool = value === "1" ? true : false;
        props.onChange(props.ruleKey, event.target.name, valueBool);
    }

    function onTimeChange(type, value) {
        value = moment(value).utc().format();
        switch (type) {
            case "start":
                setConfig((prev) => {
                    return {
                        ...prev,
                        start: value
                    };
                })
                break;
            case "end":
                setConfig((prev) => {
                    return {
                        ...prev,
                        end: value
                    };
                })
                break;
        }
    }

    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <LocalizationProvider dateAdapter={AdapterMoment} locale='csLocale'>
                <MobileTimePicker
                    onChange={(value) => onTimeChange("start", value)}
                    renderInput={(params) => <TextField {...params} />}
                    label="Čas zapnutí"
                    views={['hours', 'minutes', 'seconds']}
                    inputFormat="HH:mm:ss"
                    mask="__:__:__"
                    ampm={false}
                    cancelText="Zrušit"
                    value={moment.utc(config.start).local()}
                />
                <MobileTimePicker
                    onChange={(value) => onTimeChange("end", value)}
                    renderInput={(params) => <TextField {...params} />}
                    label="Čas vypnutí"
                    views={['hours', 'minutes', 'seconds']}
                    inputFormat="HH:mm:ss"
                    mask="__:__:__"
                    ampm={false}
                    cancelText="Zrušit"
                    value={moment.utc(config.end).local()}
                    minTime={moment.utc(config.start).local()}
                />
            </LocalizationProvider>
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