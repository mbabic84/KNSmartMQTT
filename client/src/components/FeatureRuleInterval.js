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
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {
    LocalizationProvider,
    MobileTimePicker,
    MobileDateTimePicker
} from '@mui/x-date-pickers';
import moment from 'moment';

import { FeaturesContext } from '../App';

import Constants from '../Constants';

export default function (props) {
    const { features, setFeatures } = useContext(FeaturesContext);
    const [config, setConfig] = useState({
        start: props.config?.start || moment.utc().format(),
        duration: props.config?.duration || 5,
        interval: props.config?.interval || 5
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
        switch (type) {
            case "start":
                setConfig((prev) => {
                    return {
                        ...prev,
                        start: moment(value).utc().format()
                    };
                })
                break;
            case "duration":
                setConfig((prev) => {
                    return {
                        ...prev,
                        duration: moment(value).diff(moment().startOf("year"), "second")
                    };
                })
                break;
            case "interval":
                setConfig((prev) => {
                    return {
                        ...prev,
                        interval: moment(value).diff(moment().startOf("year"), "second")
                    };
                })
                break;
        }
    }

    return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='csLocale'>
                <MobileDateTimePicker
                    onChange={(value) => onTimeChange("start", value)}
                    renderInput={(params) => <TextField {...params} />}
                    label="Začátek intervalu"
                    views={['hours', 'minutes', 'seconds']}
                    inputFormat="hh:mm:ss D.M.YYYY"
                    mask="__:__:__ __.__.____"
                    ampm={false}
                    cancelText="Zrušit"
                    value={moment.utc(config.start).local()}
                />
                <MobileTimePicker
                    onChange={(value) => onTimeChange("duration", value)}
                    renderInput={(params) => <TextField {...params} />}
                    label="Délka sepnutí"
                    views={['hours', 'minutes', 'seconds']}
                    inputFormat="HH:mm:ss"
                    mask="__:__:__"
                    ampm={false}
                    cancelText="Zrušit"
                    value={moment().startOf("year").add(config.duration, "second")}
                />
                <MobileTimePicker
                    onChange={(value) => onTimeChange("interval", value)}
                    renderInput={(params) => <TextField {...params} />}
                    label="Opakovat každých"
                    views={['hours', 'minutes', 'seconds']}
                    inputFormat="HH:mm:ss"
                    mask="__:__:__"
                    ampm={false}
                    cancelText="Zrušit"
                    value={moment().startOf("year").add(config.interval, "second")}
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