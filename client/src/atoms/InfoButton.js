import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { grey, yellow } from '@mui/material/colors';

import { FeaturesContext, AlertsContext } from '../App';

import InfoIcon from '../assets/icons/info-svgrepo-com.svg';

export default function (props) {
    const {
        features,
        setFeatures,
        setFeatureConfig
    } = useContext(FeaturesContext);

    const {
        alerts,
        setAlerts
    } = useContext(AlertsContext);

    function handleClick() {
    }

    return (
        <IconButton size="small" onClick={handleClick}>
            <SvgIcon
                component={InfoIcon}
                viewBox='0 0 258.427 258.427'
                style={{
                    fill: !props.favorite ? grey[600] : yellow[600]
                }}
                fontSize='inherit'
            />
        </IconButton>
    )
}