import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SvgIcon from '@mui/material/SvgIcon';
import { grey, yellow } from '@mui/material/colors';
import Backdrop from '@mui/material/Backdrop';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { GroupsContext, AlertsContext } from '../../App';

import GroupsApi from '../../api/Groups';
import SetAlert from '../../utils/SetAlert';

import SaveIcon from '../../assets/icons/save-svgrepo-com.svg';
import DiscardIcon from '../../assets/icons/cancel-cross-svgrepo-com.svg';

export default function (props) {
    const { groups, setGroups } = useContext(GroupsContext);
    const { alerts, setAlerts } = useContext(AlertsContext);
    const [key, setKey] = useState(uuid());
    const [name, setName] = useState("");
    const [index, setIndex] = useState(0);

    async function save() {
        if (name) {
            try {
                const newGroup = await GroupsApi.set(
                    key,
                    name,
                    index
                )
    
                setGroups([
                    ...groups,
                    newGroup
                ])
                
                SetAlert(
                    "Group was successfully created",
                    "success",
                    alerts,
                    setAlerts
                );

                props.onClose();
            } catch (e) {
                SetAlert(
                    e.message,
                    "error",
                    alerts,
                    setAlerts
                );
            }
        }
    }

    return (
        <Backdrop
            open={true}
            sx={{
                zIndex: 1
            }}
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
                        value={key}
                        disabled
                    />
                    <TextField
                        id='name'
                        label='Název'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <TextField
                        id='index'
                        label='Index'
                        value={index}
                        onChange={(event) => setIndex(event.target.value)}
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 999,
                            type: 'number',
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 5
                    }}
                >
                    <IconButton onClick={save}>
                        <SvgIcon
                            component={SaveIcon}
                            viewBox='0 0 502 502'
                            fontSize='inherit'
                            sx={{ fill: !name ? grey[600] : yellow[600] }}
                        />
                    </IconButton>
                    <IconButton onClick={props.onClose}>
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
    )
}