import React, { useEffect, useState, createContext } from 'react';
import { Route, BrowserRouter, Routes, Link } from "react-router-dom";
import _ from 'lodash';
import { createTheme, ThemeProvider } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SvgIcon from '@mui/material/SvgIcon';

import FeaturesApi from './api/Features';
import GroupsApi from './api/Groups';
import Alerts from './components/Alerts';
import NextFeaturesLoadIndicator from './components/features/NextFeaturesLoadIndicator';
import SetAlert from './utils/SetAlert';

import FeatureTab from './components/tabs/Feature';
import SettingsTab from './components/tabs/Settings';
import FeatureGroups from './components/features/Groups';

import HomeIcon from './assets/icons/home-svgrepo-com.svg';
import TemperatureIcon from './assets/icons/temperature-hot-svgrepo-com.svg';
import HumidityIcon from './assets/icons/humidity-svgrepo-com.svg';
import PressureIcon from './assets/icons/meter-svgrepo-com.svg';
import RelayIcon from './assets/icons/power-symbol-variant-hand-drawn-outline-svgrepo-com.svg';
import SettingsIcon from './assets/icons/settings-svgrepo-com.svg';

import './App.css';

export const FeaturesContext = createContext();
export const AlertsContext = createContext();
export const GroupsContext = createContext();

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
});

const routes = ['/favorites', '/temperature', '/humidity', '/pressure', '/relay', '/settings'];

const FEATURES_LOAD_INTERVAL = 15;

let loadProgressInterval;

function App() {
    const [features, setFeatures] = useState([]);
    const [activeRoute, setActiveRoute] = useState();
    const [alerts, setAlerts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [nextFeaturesLoad, setNextFeaturesLoad] = useState(null);

    useEffect(async () => {
        loadFeatures();
        loadGroups();

        const loadFeaturesInterval = setInterval(async () => {
            loadFeatures();
        }, FEATURES_LOAD_INTERVAL * 1000);

        return () => {
            clearInterval(loadFeaturesInterval);
        }
    }, []);

    async function loadFeatures() {
        try {
            setNextFeaturesLoad(Date.now() + (FEATURES_LOAD_INTERVAL * 1000));
            setFeatures(await FeaturesApi.getAll());
        } catch (e) {
            SetAlert(
                e.message,
                "error",
                alerts,
                setAlerts
            );
        }
    }

    async function loadGroups() {
        try {
            setGroups(await GroupsApi.getAll());
        } catch (e) {
            SetAlert(
                e.message,
                "error",
                alerts,
                setAlerts
            );
        }
    }

    function onTabChange(event, newActiveRoute) {
        setActiveRoute(newActiveRoute);
    }

    if (features) {
        const tabsValue = activeRoute || (window.location.pathname === "/" ? routes[0] : window.location.pathname);
        return (
            <GroupsContext.Provider
                value={{
                    groups,
                    setGroups
                }}
            >
                <AlertsContext.Provider
                    value={{
                        alerts,
                        setAlerts
                    }}
                >
                    <FeaturesContext.Provider
                        value={{
                            features,
                            setFeatures,
                            setFeatureConfig: FeaturesApi.setConfig
                        }}
                    >
                        <ThemeProvider theme={theme}>
                            <Box>
                                <BrowserRouter>
                                    <Tabs
                                        orientation='vertical'
                                        sx={{
                                            borderRight: 1,
                                            borderColor: 'divider',
                                            display: 'flex',
                                            flexGrow: 0,
                                            flexShrink: 0,
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            width: '6rem',
                                            paddingTop: 1
                                        }}
                                        value={tabsValue}
                                        onChange={onTabChange}
                                    >
                                        <Tab
                                            component={Link}
                                            to={routes[0]}
                                            value={routes[0]}
                                            icon={<SvgIcon component={HomeIcon} viewBox='0 0 490.055 490.055' />}
                                        />
                                        <Tab
                                            component={Link}
                                            to={routes[1]}
                                            value={routes[1]}
                                            icon={<SvgIcon component={TemperatureIcon} viewBox='0 0 32 32' />}
                                        />
                                        <Tab
                                            component={Link}
                                            to={routes[2]}
                                            value={routes[2]}
                                            icon={<SvgIcon component={HumidityIcon} viewBox='0 0 328.611 328.611'
                                            />} />
                                        <Tab
                                            component={Link}
                                            to={routes[3]}
                                            value={routes[3]}
                                            icon={<SvgIcon component={PressureIcon} viewBox='0 0 32 32' />}
                                        />
                                        <Tab
                                            component={Link}
                                            to={routes[4]}
                                            value={routes[4]}
                                            icon={<SvgIcon component={RelayIcon}
                                                viewBox='0 0 495.657 495.656' />}
                                        />
                                        <Tab
                                            component={Link}
                                            to={routes[5]}
                                            value={routes[5]}
                                            icon={<SvgIcon component={SettingsIcon} viewBox='0 0 492.878 492.878' />}
                                        />
                                    </Tabs>
                                    <Box
                                        sx={{ marginLeft: '6rem' }}
                                    >
                                        <Routes>
                                            <Route
                                                index
                                                element={
                                                    <FeatureGroups />
                                                }
                                            />
                                            <Route
                                                path={routes[0]}
                                                element={
                                                    <FeatureGroups />
                                                }
                                            />
                                            <Route
                                                path={routes[1]}
                                                element={
                                                    <FeatureTab
                                                        features={_.filter(features, (feature) => feature.type === "temperature")}
                                                    />
                                                }
                                            />
                                            <Route
                                                path={routes[2]}
                                                element={
                                                    <FeatureTab
                                                        features={_.filter(features, (feature) => feature.type === "humidity")}
                                                    />
                                                }
                                            />
                                            <Route
                                                path={routes[3]}
                                                element={
                                                    <FeatureTab
                                                        features={_.filter(features, (feature) => feature.type === "pressure")}
                                                    />
                                                }
                                            />
                                            <Route
                                                path={routes[4]}
                                                element={
                                                    <FeatureTab
                                                        features={_.filter(features, (feature) => feature.type === "relay")}
                                                    />
                                                }
                                            />
                                            <Route
                                                path={routes[5]}
                                                element={
                                                    <SettingsTab
                                                    />
                                                }
                                            />
                                        </Routes>
                                    </Box>
                                </BrowserRouter>
                                <NextFeaturesLoadIndicator nextFeaturesLoad={nextFeaturesLoad}/>
                            </Box>
                        </ThemeProvider>
                    </FeaturesContext.Provider>
                    <Alerts />
                </AlertsContext.Provider>
            </GroupsContext.Provider>
        );
    } else {
        return (
            <Backdrop
                open={true}
            >
                <CircularProgress color="primary" />
            </Backdrop>
        )
    }
}

export default App;