import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import React, { useContext, useState, useEffect } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import { grey, yellow } from '@mui/material/colors';
import _ from 'lodash';

import FeaturesApi from '../api/Features';

import SaveIcon from '../assets/icons/save-svgrepo-com.svg';
import DiscardIcon from '../assets/icons/cancel-cross-svgrepo-com.svg';

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

            await setFeatures(_.map(features, (feature) => {
                if (feature.key === props.featureKey) {
                    return updatedFeature;
                } else {
                    return feature;
                }
            }));

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
        <Backdrop
            open={true}
            sx={{
                zIndex: 1
            }}
            onClick={handleDiscard}
        >
            <Container
                sx={{
                    bgcolor: '#121212',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: 3,
                    paddingBottom: 3
                }}
                maxWidth='xs'
            >
                <Box
                    sx={{ display: 'flex', gap: 4, flexDirection: 'column' }}
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
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 5
                    }}
                >
                    <IconButton onClick={handleSave}>
                        <SvgIcon
                            component={SaveIcon}
                            viewBox='0 0 502 502'
                            fontSize='inherit'
                            sx={{ fill: !_.keys(changes).length ? grey[600] : yellow[600] }}
                        />
                    </IconButton>
                    <IconButton onClick={handleDiscard}>
                        <SvgIcon
                            component={DiscardIcon}
                            viewBox='0 0 502 502'
                            fontSize='inherit'
                            color='error'
                        />
                    </IconButton>
                </Box>
            </Container>
        </Backdrop>
    );
}