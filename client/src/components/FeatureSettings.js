import React, { useContext, useState } from 'react';
import {
    Dialog,
    Container,
    TextField,
    Box,
    Chip,
    Autocomplete,
    Button,
    Card
} from '@mui/material'
import _ from 'lodash';

import FeaturesApi from '../api/Features';
import SetAlert from '../utils/SetAlert';

import { FeaturesContext, GroupsContext } from '../App'

export default function (props) {
    const { features, setFeatures } = useContext(FeaturesContext);
    const { groups, setGroups } = useContext(GroupsContext);
    const [changes, setChanges] = useState({});
    const feature = _.find(features, (feature) => feature.key === props.featureKey);
    const [groupsValue, setGroupsValue] = useState(_.filter(groups, (group) => {
        return props.config?.groups?.includes(group.key);
    }))

    async function handleSave(event) {
        event.stopPropagation();
        if (_.keys(changes).length) {
            const updatedFeature = await FeaturesApi.setConfig(
                props.featureKey,
                {
                    ...feature.config,
                    ...changes
                }
            )

            setFeatures(_.map(features, (feature) => {
                if (feature.key === props.featureKey) {
                    return updatedFeature;
                } else {
                    return feature;
                }
            }));

            SetAlert(
                "Nastavení úspěšně uloženo",
                "success"
            )

            props.onClose();
        }
    }

    function handleDiscard(event) {
        event.stopPropagation();
        props.onClose();
    }

    function handleChange(event) {
        let nextChanges = {
            ...changes,
            [event.target.id]: event.target.value
        }

        setChanges(nextChanges);
    }

    function handleGroupsChange(event, value) {
        let nextChanges = {
            ...changes,
            groups: _.map(value, 'key')
        }

        setGroupsValue(value);
        setChanges(nextChanges);
    }

    return (
        <Dialog
            open={true}
            sx={{ zIndex: 1 }}
            onClick={handleDiscard}
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
                maxWidth='sm'
                onClick={(event) => event.stopPropagation()}
            >
                <Card
                    variant='elevation'
                    sx={{
                        margin: 1,
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <TextField
                        id='key'
                        label='Identifikátor'
                        defaultValue={feature.key}
                        disabled
                    />
                    <TextField
                        id='name'
                        label='Název'
                        defaultValue={changes.name || feature.config.name || feature.key}
                        onChange={handleChange}
                    />
                    <TextField
                        id='description'
                        label='Popis'
                        defaultValue={changes.description || feature.config.description || feature.type}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        multiple={true}
                        options={groups}
                        getOptionLabel={(option) => option.name}
                        value={groupsValue}
                        filterSelectedOptions
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    label="Skupiny"
                                />
                            )
                        }}
                        onChange={handleGroupsChange}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Button onClick={handleSave} >
                            Uložit
                        </Button>
                        <Button onClick={handleDiscard} >
                            Zahodit
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Dialog>
    );
}