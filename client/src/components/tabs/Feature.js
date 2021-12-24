import React, { useContext } from 'react';
import {
    Box,
    Card,
    Typography,
    Divider
} from '@mui/material';
import _ from 'lodash';

import CommonFeature from '../features/Common';

function Feature(props) {
    function listFeatures(features) {
        return _.map(features, (feature) => {
            return <CommonFeature featureKey={feature.key} {...feature} />
        })
    }

    function deviceGroups() {
        const groups = _.groupBy(props.features, (feature) => feature.deviceKey);

        return Object.entries(groups).map(([deviceKey, features]) => {
            return (
                <Card
                    sx={{ display: 'flex', flexDirection: 'column' }}
                >
                    <Typography
                        variant='h6'
                        sx={{ margin: 1 }}
                    >
                        {deviceKey}
                    </Typography>
                    <Divider />
                    <Box
                        sx={{ display: 'flex', flexWrap: 'wrap' }}
                    >
                        {listFeatures(features)}
                    </Box>
                </Card>
            )
        });
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                marginTop: 2
            }}
        >
            {deviceGroups()}
        </Box>
    )
}

export default Feature;