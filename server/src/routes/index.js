import cors from 'cors';
import express from 'express';

import apiFeatures from "../api/features.js";
import apiGroups from "../api/groups.js";
import apiRules from "../api/rules.js";

async function init(app) {
    app.use(cors());
    app.use(express.json());

    app.get('/features', apiFeatures.get);
    app.get('/feature/chart', apiFeatures.getChartData);
    app.put('/feature/config', apiFeatures.setConfig);
    app.get('/groups', apiGroups.get);
    app.put('/group', apiGroups.set);
    app.delete('/group', apiGroups.del);
    app.get('/rules', apiRules.get);
    app.put('/rule', apiRules.set);
    app.delete('/rule', apiRules.del);
}

export default {
    init
}