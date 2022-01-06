import React, {
    useEffect,
    useState,
    createContext
} from 'react';
import {
    Route,
    BrowserRouter,
    Routes,
    Link
} from "react-router-dom";
import {
    createTheme,
    ThemeProvider,
    Box,
    CircularProgress,
    Backdrop,
    Tabs,
    Tab,
    SvgIcon
} from '@mui/material';
import { io } from 'socket.io-client';
import _ from 'lodash';

import FeaturesApi from './api/Features';
import GroupsApi from './api/Groups';
import RulesApi from './api/Rules';
import LogApi from './api/Log';
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
export const GroupsContext = createContext();
export const RulesContext = createContext();
export const LogContext = createContext();

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
});

const routes = ['/home', '/features', '/settings'];

function App() {
    const [features, setFeatures] = useState([]);
    const [activeRoute, setActiveRoute] = useState();
    const [groups, setGroups] = useState([]);
    const [rules, setRules] = useState([]);
    const [log, setLog] = useState([]);

    useEffect(async () => {
        loadFeatures();
        loadGroups();
        loadRules();
        loadLog();

        const socket = io(ApiUrl(), { path: '/updates' });
        socket.on("feature", (nextFeature) => {
            setFeatures((prevFeatures) => {
                let exists;
                const nextFeatures = prevFeatures.map((prevFeature) => {
                    if (prevFeature.key === nextFeature.key) {
                        exists = true;
                        return nextFeature;
                    } else {
                        return prevFeature;
                    }
                });

                if (!exists) {
                    nextFeatures.push(nextFeature);
                }

                return nextFeatures;
            })
        })
        socket.on("log", (logLine) => {
            setLog((prevLogLines) => {
                return [
                    logLine,
                    ...prevLogLines,
                ]
            });
        })
    }, []);

    async function loadFeatures() {
        try {
            setFeatures(await FeaturesApi.getAll());
        } catch (e) {
            SetAlert(
                e.message,
                "error"
            );
        }
    }

    async function loadGroups() {
        try {
            setGroups(await GroupsApi.getAll());
        } catch (e) {
            SetAlert(
                e.message,
                "error"
            );
        }
    }

    async function loadRules() {
        try {
            setRules(await RulesApi.getAll());
        } catch (e) {
            SetAlert(
                e.message,
                "error"
            );
        }
    }

    async function loadLog() {
        try {
            setLog(await LogApi.get());
        } catch (e) {
            SetAlert(
                e.message,
                "error"
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
                <Alerts />
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
                            <LogContext.Provider value={{ log }}>
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
                            </LogContext.Provider>
                        </ThemeProvider>
                    </RulesContext.Provider>
                </FeaturesContext.Provider>
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