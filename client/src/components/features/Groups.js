import React, { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import _ from 'lodash';

import { GroupsContext } from '../../App';
import Group from './Group';
import GroupAddButton from '../../atoms/GroupAddButton';
import GroupAddForm from './GroupAddForm';

export default function (props) {
    const { groups, setGroups } = useContext(GroupsContext);
    const [newGroupFormOpen, setNewGroupFormOpen] = useState(false);

    function groupList() {
        const list = _.map(_.orderBy(groups, ['index']), (group) => {
            return <Group {...group} groupKey={group.key} />
        })

        return (
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                {list}
            </Box>
        )
    }

    function groupAddForm() {
        if (newGroupFormOpen) {
            return (
                <GroupAddForm onClose={() => setNewGroupFormOpen(false)} />
            )
        }
    }

    function groupAddButton() {
        return (
            <Container
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <GroupAddButton onClick={() => setNewGroupFormOpen(true)} />
            </Container>
        )
    }

    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
            paddingTop: 1
        }}>
            {groupList()}
            {groupAddButton()}
            {groupAddForm()}
        </Box>
    );
}