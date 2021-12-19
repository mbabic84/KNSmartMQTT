import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import { grey } from '@mui/material/colors';

import SettingsIcon from '../assets/icons/settings-svgrepo-com.svg';

export default function(props) {
    return (
        <IconButton size="small" onClick={() => {
            if (props.onClick) {
                props.onClick();
            }
        }}>
            <SvgIcon
                component={SettingsIcon}
                viewBox='0 0 492.878 492.878'
                style={{
                    fill: grey[600]
                }}
                fontSize='inherit'
            />
        </IconButton>
    );
}