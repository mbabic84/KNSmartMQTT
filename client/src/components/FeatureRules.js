import React, {
    useContext,
    useState,
    useEffect
} from 'react';
import {
    Container,
    Box,
    Card,
    Select,
    MenuItem,
    FormControl,
    Typography,
    Button,
    Dialog
} from '@mui/material';
import { v4 as uuid } from 'uuid';

import { RulesContext } from '../App';

import AddButton from '../atoms/AddButton';
import FeatureRuleHeater from './FeatureRuleHeater';
import FeatureRuleTimer from './FeatureRuleTimer';
import FeatureRuleInterval from './FeatureRuleInterval';
import RulesApi from '../api/Rules';
import SetAlert from '../utils/SetAlert';

import Constants from '../Constants';

export default function (props) {
    const { rules, setRules } = useContext(RulesContext);
    const [featureRules, setFeatureRules] = useState([]);

    useEffect(() => {
        setFeatureRules(() => {
            return _.filter(rules, (rule) => {
                return rule.current === props.featureKey
                    || (
                        !rule.current
                        && rule.handler
                        && props.type === "relay"
                        && rule.handler === props.featureKey
                    );
            })
        })
    }, [rules])

    function addRule() {
        setRules((prevRules) => {
            return [
                ...prevRules,
                {
                    key: uuid(),
                    current: props.type !== "relay" ? props.featureKey : null,
                    setpoint: null,
                    handler: props.type === "relay" ? props.featureKey : null
                }
            ]
        })
    }

    async function save(ruleKey) {
        const rule = featureRules.find((rule) => rule.key === ruleKey);
        if (
            rule
            && rule.type
        ) {
            try {
                let set = await RulesApi.set(rule);
                setRules((prevRules) => {
                    return prevRules.map((rule) => {
                        if (set.key === rule.key) {
                            return set;
                        } else {
                            return rule;
                        }
                    })
                });
                SetAlert(
                    "Pravidlo bylo úspěšně uloženo",
                    "success"
                )
            } catch (error) {
                SetAlert(
                    error.message,
                    "error")
            }

        }
    }

    async function discard(ruleKey) {
        const rule = rules.find((rule) => rule.key === ruleKey);

        if (rule && rule.created) {
            await RulesApi.del(rule.key);
        }

        setRules((prevRules) => {
            return prevRules
                .filter((rule) => {
                    return rule.key !== ruleKey;
                })
        })
    }

    function typeItems(ruleKey) {
        return Object
            .entries(Constants.rules.types)
            .filter(([type, rule]) => {
                return rule.features.includes(props.type);
            })
            .map(([type, { name, description }]) => {
                return (
                    <MenuItem key={`${ruleKey}#${type}`} value={type}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            color: Constants.colors.select.primary
                        }}>
                            <Typography variant='subtitle2'>
                                {name}
                            </Typography>
                            <Typography variant='caption'>
                                {description}
                            </Typography>
                        </Box>
                    </MenuItem>
                )
            })
    }

    function ruleTypeContent(rule) {
        switch (rule.type) {
            case "heater":
                return (
                    <FeatureRuleHeater
                        ruleKey={rule.key}
                        {...rule}
                        onChange={onRuleChange}
                    />
                )
            case "timer":
                return (
                    <FeatureRuleTimer
                        ruleKey={rule.key}
                        {...rule}
                        onChange={onRuleChange}
                    />
                )
            case "interval":
                return (
                    <FeatureRuleInterval
                        ruleKey={rule.key}
                        {...rule}
                        onChange={onRuleChange}
                    />
                )
        }
    }

    function onRuleChange(ruleKey, property, value) {
        setFeatureRules((prevFeatureRules) => {
            return prevFeatureRules.map((rule) => {
                if (rule.key === ruleKey && property === "type" && value === "") {
                    return {
                        key: rule.key
                    }
                } else if (rule.key === ruleKey) {
                    return {
                        ...rule,
                        [property]: value
                    }
                } else {
                    return rule;
                }
            })
        })
    }

    function listRules() {
        return featureRules.map((rule) => {
            return (
                <Card
                    key={rule.key}
                    variant='elevation'
                    sx={{
                        margin: 1,
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <FormControl>
                        <Select
                            value={rule.type || ""}
                            displayEmpty
                            name="type"
                            onChange={(event) => onRuleChange(rule.key, event.target.name, event.target.value)}
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
                                        Druh ovládání
                                    </Typography>
                                    <Typography variant='caption'>
                                        Určuje chování pravidla ovládání
                                    </Typography>
                                </Box>
                            </MenuItem>
                            {typeItems(rule.key)}
                        </Select>
                    </FormControl>
                    {ruleTypeContent(rule)}
                    <Box
                        sx={{ display: 'flex', justifyContent: 'space-around' }}
                    >
                        <Button onClick={() => save(rule.key)}>
                            Uložit
                        </Button>
                        <Button onClick={() => discard(rule.key)}>
                            Smazat
                        </Button>
                    </Box>
                </Card>
            )
        })
    }

    return (
        <Dialog
            open={true}
            onClick={(e) => {
                e.stopPropagation();
                props.onClose();
            }}
            sx={{ zIndex: 1 }}
            scroll="body"
            maxWidth="sm"
            fullWidth={true}
        >
            <Container
                sx={{
                    bgcolor: '#121212',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: 3,
                    paddingBottom: 3
                }}
                onClick={(e) => e.stopPropagation()}
                maxWidth='sm'
            >
                {listRules()}
                <Box
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <AddButton onClick={addRule} />
                </Box>
            </Container>
        </Dialog>
    )
}