import moment from 'moment';

import pgPool from "./pool.js";

async function set({ featureKey, value }) {
    const pgResult = await pgPool()
        .query(
            `INSERT INTO "history" (
                "featureKey",
                "value"
            ) VALUES (
                '${featureKey}',
                '${value}'
            ) RETURNING *`
        )

    return pgResult.rows[0];
}

async function getForFeature({
    featureKey,
    since = moment.utc().subtract(24, "hours").format()
}) {
    const pgResult = await pgPool()
        .query(
            `SELECT 
                "value"::real, "created" 
            FROM 
                "history" 
            WHERE 
                "featureKey" = '${featureKey}' 
                AND "created" > '${since}'
            ORDER BY 
                "created"`
        )

    return pgResult.rows;
}

export default {
    set,
    getForFeature
}