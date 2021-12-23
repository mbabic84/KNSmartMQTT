import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import { grey } from '@mui/material/colors';

import ControlIcon from '../assets/icons/control-svgrepo-com.svg';

export default function(props) {
    return (
        <IconButton size="small" onClick={() => {
            if (props.onClick) {
                props.onClick();
            }
        }}>
            <SvgIcon
                component={ControlIcon}
                viewBox='0 0 1024 1024'
                style={{
                    fill: grey[600]
                }}
                fontSize='inherit'
            />
        </IconButton>
    );
}