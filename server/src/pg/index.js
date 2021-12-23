import pgPool from './pool.js';

import devices from './tables/devices.js';
import features from './tables/features.js';
import history from './tables/history.js';
import rules from './tables/rules.js';
import configuration from './tables/configuration.js';
import groups from './tables/groups.js';

async function init() {
    let queries = [];

    queries.push("BEGIN");

    queries = queries.concat(devices);
    queries = queries.concat(features);
    queries = queries.concat(history);
    queries = queries.concat(rules);
    queries = queries.concat(configuration);
    queries = queries.concat(groups);

    queries.push("COMMIT");

    return pgPool()
        .query(queries.join(";"));
}

export default {
    init
}