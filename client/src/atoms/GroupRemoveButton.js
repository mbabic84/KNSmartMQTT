import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import { grey } from '@mui/material/colors';

import RemoveIcon from '../assets/icons/rubbish-bin-svgrepo-com.svg';

export default function (props) {
    const [alertActive, setAlertActive] = useState(false);

    function handleOnClick(event) {
        event.stopPropagation();
        setAlertActive(true);
    }

    function handleAgree() {
        setAlertActive(false);
        props.removeGroup();
    }

    function handleDisagree() {
        setAlertActive(false);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <IconButton size='small' onClick={handleOnClick} >
                <SvgIcon
                    component={RemoveIcon}
                    viewBox='0 0 485.726 485.726'
                    style={{
                        fill: grey[600]
                    }}
                    fontSize='inherit'
                />
            </IconButton>
            <Dialog open={alertActive} onClick={(event) => event.stopPropagation()}>
                <DialogTitle>
                    Smazat skupinu
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Opravdu smazat skupinu "{props.groupName}"
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDisagree}>
                        Ne
                    </Button>
                    <Button onClick={handleAgree} autoFocus>
                        Jasný
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}