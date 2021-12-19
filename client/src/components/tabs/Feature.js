import React, { useContext } from 'react';
import Box from '@mui/material/Box';

import CommonFeature from '../features/Common';

function Feature(props) {
    function featureComponents() {
        return _.map(props.features, (feature) => {
            return <CommonFeature featureKey={feature.key} {...feature} />
        })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap'
            }}
        >
            {featureComponents()}
        </Box>
    )
}

export default Feature;