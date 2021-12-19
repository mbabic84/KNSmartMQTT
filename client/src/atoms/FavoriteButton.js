import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { grey, yellow } from '@mui/material/colors';
import { v4 as uuid } from 'uuid';

import { FeaturesContext, AlertsContext } from '../App';

import FavoriteIcon from '../assets/icons/star-favorite-svgrepo-com.svg';

import Constants from '../Constants';

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

    async function handleClick() {
        setFeatures(
            await Promise.all(
                features.map(async (feature) => {
                    if (feature.key === props.featureKey) {
                        try {
                            let groups = feature.config.groups || [];
                            
                            if (groups.includes(Constants.groups.favorite.key)) {
                                groups = _.filter(groups, (groupKey) => groupKey !== Constants.groups.favorite.key);
                            } else {
                                groups.push(Constants.groups.favorite.key);
                            }

                            return await setFeatureConfig(
                                props.featureKey,
                                {
                                    ...feature.config,
                                    groups
                                }
                            )
                        } catch (e) {
                            setAlerts([...alerts, {
                                key: uuid(),
                                type: "error",
                                message: e.message,
                                created: Date.now()
                            }]);
                            return feature;
                        }
                    } else {
                        return feature;
                    }
                })
            )
        )
    }

    return (
        <IconButton size="small" onClick={handleClick}>
            <SvgIcon
                component={FavoriteIcon}
                viewBox='0 0 375.586 375.586'
                style={{
                    fill: !props.config.groups?.includes(Constants.groups.favorite.key) ? grey[600] : yellow[600]
                }}
                fontSize='inherit'
            />
        </IconButton>
    )
}