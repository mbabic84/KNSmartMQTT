import React, {
    useContext,
    useState,
    useEffect
} from 'react';
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography
} from '@mui/material';
import {
    DragDropContext,
    Droppable,
    Draggable
} from 'react-beautiful-dnd';
import _ from 'lodash';

import {
    FeaturesContext,
    GroupsContext
} from '../../App';

import GroupsApi from '../../api/Groups';
import SetAlert from '../../utils/SetAlert';

import CommonFeature from './Common';
import GroupRemoveButton from '../../atoms/GroupRemoveButton';

import Constants from '../../Constants';
import ArrayMove from '../../utils/ArrayMove';

export default function (props) {
    const { features, setFeatures } = useContext(FeaturesContext);
    const { groups, setGroups } = useContext(GroupsContext);
    const [groupFeatures, setGroupFeatures] = useState([]);

    useEffect(() => {
        const filtered = _.filter(features, (feature) => {
            return feature.config?.groups?.includes(props.groupKey);
        });

        let sorted = [];
        let unsorted = [];

        if (props.config.order) {
            props.config.order.map((featureKey) => {
                const feature = _.find(filtered, (feature) => feature.key === featureKey);
                if (feature) {
                    sorted.push(feature);
                }
            })
            unsorted = _.filter(filtered, (feature) => {
                return !_.map(sorted, 'key').includes(feature.key);
            });
        } else {
            unsorted = filtered;
        }

        setGroupFeatures([...sorted, ...unsorted]);
    }, [features, groups])

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
            const updatedGroup = await GroupsApi.set({
                key: props.groupKey,
                name,
                index,
                config
            });

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
                "success"
            );
        } catch (error) {
            SetAlert(
                error.message,
                "error"
            );
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
                "success"
            )
        } catch (error) {
            SetAlert(
                error.message,
                "error"
            )
        }
    }

    async function onDragEnd(result) {
        const group = _.find(groups, (group) => group.key === props.groupKey);
        const order = ArrayMove(
            groupFeatures,
            result.source.index,
            result.destination.index
        ).map((feature) => feature.key);

        if (group) {
            try {
                const patch = {
                    ...group,
                    config: {
                        ...group.config,
                        order
                    }
                };
                const updated = await GroupsApi.set(patch);
                setGroups(
                    groups.map((group) => {
                        if (group.key === updated.key) {
                            return updated;
                        } else {
                            return group;
                        }
                    })
                )
                SetAlert(
                    "Skupina byla aktualizována",
                    "success"
                )
            } catch (e) {
                SetAlert(
                    e.message,
                    "error"
                )
            }
        }
    }

    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Accordion
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
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided, snapshot) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{ display: 'flex' }}
                                >
                                    {groupFeatures.map((feature, index) => {
                                        return (
                                            <Draggable key={feature.key} draggableId={feature.key} index={index}>
                                                {(provided, snapshot) => {
                                                    return (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <CommonFeature
                                                                {...feature}
                                                                featureKey={feature.key}
                                                                group={{ ...props }}
                                                            />
                                                        </div>
                                                    )
                                                }}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}