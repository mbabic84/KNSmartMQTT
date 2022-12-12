import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import { grey } from '@mui/material/colors';

import {ReactComponent as DetailsIcon} from '../../public/static/icons/magnifier-hand-drawn-searching-tool-svgrepo-com.svg'

export default function(props) {
    return (
        <IconButton size="small" onClick={() => {
            if (props.onClick) {
                props.onClick();
            }
        }}>
            <SvgIcon
                component={DetailsIcon}
                viewBox='0 0 185.846 185.846'
                style={{
                    fill: grey[600]
                }}
                fontSize='inherit'
            />
        </IconButton>
    );
}