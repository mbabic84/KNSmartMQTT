import cors from 'cors';
import express from 'express';

import featuresApi from "../api/features.js";
import groupsApi from "../api/groups.js";
import rulesApi from "../api/rules.js";
import logApi from '../api/log.js';
import devicesApi from '../api/devices.js';

async function init(app) {
    app.use(cors());
    app.use(express.json());

    app.get('/features', featuresApi.get);
    app.get('/feature/chart', featuresApi.getChartData);
    app.put('/feature/config', featuresApi.setConfig);
    app.get('/groups', groupsApi.get);
    app.put('/group', groupsApi.set);
    app.delete('/group', groupsApi.del);
    app.get('/rules', rulesApi.get);
    app.put('/rule', rulesApi.set);
    app.delete('/rule', rulesApi.del);
    app.get('/log', logApi.get);
    app.get('/devices', devicesApi.get);
    app.get('/devices/:key', devicesApi.get);
}

export default {
    init
}