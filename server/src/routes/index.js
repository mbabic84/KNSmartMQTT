import cors from 'cors';
import express from 'express';

import FeaturesApi from "../api/features.js";
import groupsApi from "../api/groups.js";
import rulesApi from "../api/rules.js";
import logApi from '../api/log.js';

async function init(app) {
    app.use(cors());
    app.use(express.json());

    app.get('/features', FeaturesApi.get);
    app.get('/feature/chart', FeaturesApi.getChartData);
    app.put('/feature/config', FeaturesApi.setConfig);
    app.get('/groups', groupsApi.get);
    app.put('/group', groupsApi.set);
    app.delete('/group', groupsApi.del);
    app.get('/rules', rulesApi.get);
    app.put('/rule', rulesApi.set);
    app.delete('/rule', rulesApi.del);
    app.get('/log', logApi.get);
}

export default {
    init
}