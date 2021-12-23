import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import { Route, BrowserRouter, Routes, Link } from "react-router-dom";
import _ from 'lodash';
import { createTheme, ThemeProvider } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SvgIcon from '@mui/material/SvgIcon';
import { io } from 'socket.io-client';

import FeaturesApi from './api/Features';
import GroupsApi from './api/Groups';
import RulesApi from './api/Rules';
import Alerts from './components/Alerts';
import SetAlert from './utils/SetAlert';

import FeatureTab from './components/tabs/Feature';
import SettingsTab from './components/tabs/Settings';
import FeatureGroups from './components/features/Groups';
import ApiUrl from './utils/ApiUrl';

import HomeIcon from './assets/icons/home-svgrepo-com.svg';
import SettingsIcon from './assets/icons/settings-svgrepo-com.svg';
import FeatureIcon from './assets/icons/component-1-svgrepo-com.svg';

import './App.css';

export const FeaturesContext = createContext();
export const AlertsContext = createContext();
export const GroupsContext = createContext();
export const RulesContext = createContext();

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
});

const routes = ['/home', '/features', '/settings'];

function App() {
    const [features, setFeatures] = useState([]);
    const [activeRoute, setActiveRoute] = useState();
    const [alerts, setAlerts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [rules, setRules] = useState([]);
    const featuresRef = useRef();
    const ioUpdatesRef = useRef();

    useEffect(async () => {
        loadFeatures();
        loadGroups();
        loadRules();
    }, []);

    useEffect(() => {
        featuresRef.current = features;
        if (!ioUpdatesRef.current && featuresRef.current.length) {
            initIoUpdates();
        }
    }, [features]);

    function initIoUpdates() {
        ioUpdatesRef.current = io(ApiUrl(), { path: '/updates' });
        ioUpdatesRef.current.on("feature", (featureUpdate) => {
            setFeatures(_.map(featuresRef.current, (feature) => {
                if (feature.key === featureUpdate.key) {
                    return featureUpdate;
                } else {
                    return feature;
                }
            }));
        });
    }

    async function loadFeatures() {
        try {
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

    async function loadRules() {
        try {
            setRules(await RulesApi.getAll());
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
                        <RulesContext.Provider
                            value={{
                                rules,
                                setRules
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
                                                icon={<SvgIcon component={FeatureIcon} viewBox='0 0 15 15' />}
                                            />
                                            <Tab
                                                component={Link}
                                                to={routes[2]}
                                                value={routes[2]}
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
                                                            features={features}
                                                        />
                                                    }
                                                />
                                                <Route
                                                    path={routes[2]}
                                                    element={
                                                        <SettingsTab
                                                        />
                                                    }
                                                />
                                            </Routes>
                                        </Box>
                                    </BrowserRouter>
                                </Box>
                            </ThemeProvider>
                        </RulesContext.Provider>
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