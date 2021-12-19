import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import { grey } from '@mui/material/colors';

import ChartIcon from '../assets/icons/line-chart-svgrepo-com.svg';

export default function(props) {
    return (
        <IconButton size="small" onClick={() => {
            if (props.onClick) {
                props.onClick();
            }
        }}>
            <SvgIcon
                component={ChartIcon}
                viewBox='0 0 291.837 291.837'
                style={{
                    fill: grey[600]
                }}
                fontSize='inherit'
            />
        </IconButton>
    );
}