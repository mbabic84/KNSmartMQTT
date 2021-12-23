import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Acordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { grey } from '@mui/material/colors';
import _ from 'lodash';

import {
    FeaturesContext,
    GroupsContext,
    AlertsContext
} from '../../App';

import GroupsApi from '../../api/Groups';
import SetAlert from '../../utils/SetAlert';

import CommonFeature from './Common';
import GroupRemoveButton from '../../atoms/GroupRemoveButton';

import Constants from '../../Constants';

export default function (props) {
    const { features, setFeatures } = useContext(FeaturesContext);
    const { groups, setGroups } = useContext(GroupsContext);
    const { alerts, setAlerts } = useContext(AlertsContext);

    const groupFeatures = _.filter(features, (feature) => {
        return feature?.config?.groups?.includes(props.groupKey);
    });

    function handleGroupExpandChange(event, expanded) {
        updateGroup(
            props.name,
            props.index,
            {
                ...props.config,
                expanded
            }
        )
    }

    async function updateGroup(name, index, config) {
        try {
            const updatedGroup = await GroupsApi.update(props.groupKey, name, index, config);
            setGroups(
                _.map(groups, (group) => {
                    if (group.key === props.groupKey) {
                        return updatedGroup;
                    } else {
                        return group;
                    }
                })
            );
            SetAlert(
                "Skupina byla aktualizována",
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

    async function removeGroup() {
        try {
            await GroupsApi.del(props.groupKey);
            setGroups(
                _.filter(groups, (group) => group.key !== props.groupKey)
            );
            SetAlert(
                "Skupina byla smazána",
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

    function listFeatures() {
        return _.map(groupFeatures, (feature) => {
            return <CommonFeature
                featureKey={feature.key}
                {...feature}
                group={{...props}}
            />
        })
    }

    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Acordion
                disableGutters
                defaultExpanded={props.config?.expanded}
                expanded={props.config?.expanded}
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column'
                }}
                onChange={handleGroupExpandChange}
            >
                <AccordionSummary>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexGrow: 1
                    }}>
                        <Typography variant='h6' sx={{ color: Constants.colors.text.primary }}>
                            {props.name}
                        </Typography>
                        <GroupRemoveButton groupName={props.name} removeGroup={removeGroup} />
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {listFeatures()}
                    </Box>
                </AccordionDetails>
            </Acordion>
        </Box>
    )
}