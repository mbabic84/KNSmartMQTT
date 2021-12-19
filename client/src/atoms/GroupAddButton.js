import React from 'react';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';

import { grey } from '@mui/material/colors';

import AddIcon from '../assets/icons/add-svgrepo-com.svg';

export default function (props) {
    return (
        <IconButton size='large' onClick={props.onClick}>
            <SvgIcon
                component={AddIcon}
                viewBox='0 0 485.726 485.726'
                style={{
                    fill: grey[600]
                }}
                fontSize='inherit'
            />
        </IconButton>
    )
}