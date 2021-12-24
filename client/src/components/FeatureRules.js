import React, { useContext } from 'react';
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

import { RulesContext, AlertsContext } from '../App';

import AddButton from '../atoms/AddButton';
import FeatureRuleHeater from './FeatureRuleHeater';
import RulesApi from '../api/Rules';
import SetAlert from '../utils/SetAlert';

import Constants from '../Constants';

export default function (props) {
    const { rules, setRules } = useContext(RulesContext);
    const { alerts, setAlerts } = useContext(AlertsContext);

    function addNewRule() {
        setRules([
            ...rules,
            {
                key: uuid(),
                current: props.featureKey
            }
        ])
    }

    async function save(ruleKey) {
        const rule = rules.find((rule) => rule.key === ruleKey);
        if (
            rule
            && rule.setpoint
            && rule.handler
        ) {
            try {
                let set = await RulesApi.set(rule);
                setRules(
                    rules.map((rule) => {
                        if (set.key === ruleKey) {
                            return set;
                        } else {
                            return rule;
                        }
                    })
                )
                SetAlert(
                    "Pravidlo bylo úspěšně uloženo",
                    "success",
                    alerts,
                    setAlerts
                )
            } catch (error) {
                SetAlert(
                    error.message,
                    "error",
                    alerts,
                    setAlerts
                )
            }

        }
    }

    async function discard(ruleKey) {
        const rule = rules.find((rule) => rule.key === ruleKey);

        if (rule && rule.created) {
            await RulesApi.del(rule.key);
        }

        setRules(
            rules
                .filter((rule) => {
                    return rule.key !== ruleKey;
                })
        )
    }

    function typeItems(ruleKey) {
        return Object
            .entries(Constants.rules.types)
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
                        key={rule.key}
                        ruleKey={rule.key}
                        {...rule}
                        onChange={onRuleChange}
                    />
                )
        }
    }

    function onRuleChange(ruleKey, property, value) {
        setRules(rules.map((rule) => {
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
        }))
    }

    function listRules() {
        return rules.map((rule) => {
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
                    <AddButton onClick={addNewRule} />
                </Box>
            </Container>
        </Dialog>
    )
}