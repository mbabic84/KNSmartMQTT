import React, { useState, useContext } from 'react';
import {
    Box,
    Container,
    Button,
    TextField,
    Backdrop
} from '@mui/material'
import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { GroupsContext } from '../../App';

import GroupsApi from '../../api/Groups';
import SetAlert from '../../utils/SetAlert';

export default function (props) {
    const { groups, setGroups } = useContext(GroupsContext);
    const [key, setKey] = useState(uuid());
    const [name, setName] = useState("");
    const [index, setIndex] = useState(0);

    async function save() {
        if (name) {
            try {
                const newGroup = await GroupsApi.set({
                    key,
                    name,
                    index
                })

                setGroups([
                    ...groups,
                    newGroup
                ])

                SetAlert(
                    "Group was successfully created",
                    "success"
                );

                props.onClose();
            } catch (e) {
                SetAlert(
                    e.message,
                    "error"
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
            onClick={props.onClose}
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
                onClick={(e) => e.stopPropagation()}
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
                    <Button onClick={save}>
                        Uložit
                    </Button>
                    <Button onClick={props.onClose}>
                        Zahodit
                    </Button>
                </Box>
            </Container>
        </Backdrop>
    )
}