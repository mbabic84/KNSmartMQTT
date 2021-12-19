import pgPool from './pool.js';
import Constants from '../Constants.js';

async function get() {
    const pgResult = pgPool()
        .query(`SELECT * FROM "features"`);

    return pgResult.rows;
}

async function set({ key, deviceKey, type, value, config = {} }) {
    const pgResult = await pgPool()
        .query(
            `INSERT INTO "features" (
                "key",
                "deviceKey",
                "type",
                "value",
                "config"
            ) VALUES (
                '${key}',
                '${deviceKey}',
                '${type}',
                '${value}',
                '${JSON.stringify(config)}'
            ) ON CONFLICT ("key") DO UPDATE SET
                "deviceKey" = '${deviceKey}',
                "type" = '${type}',
                "value" = '${value}',
                "config" = EXCLUDED."config" || '${JSON.stringify(config)}'::JSONB
            RETURNING *`
        )

    return pgResult.rows[0];
}

async function setConfig({ key, config = {} }) {
    const pgResult = await pgPool()
        .query(
            `INSERT INTO "features" (
                "key"
                "config"
            ) VALUES (
                '${key}',
                '${JSON.stringify(config)}'
            ) ON CONFLICT ("key") DO UPDATE SET
                "config" = EXCLUDED."config" || '${JSON.stringify(config)}'::JSONB
            RETURNING *`
        )

    return pgResult.rows[0];
}

async function setHistory({ featureKey, value }) {
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

function saveReport(report, deviceKey) {
    Object
        .entries(report)
        .forEach(async ([property, value]) => {
            if (Constants.featureMap.hasOwnProperty(property)) {
                let type = Constants.featureMap[property];

                if (
                    typeof Constants.featureMap[property] === 'function'
                    && typeof value === 'object'
                    && value !== null
                ) {
                    const types = Constants.featureMap[property](value);
                    types
                        .forEach(async (map) => {
                            if (value.hasOwnProperty(map.key)) {
                                await set({
                                    key: `${deviceKey}/${map.type}`,
                                    deviceKey,
                                    type: map.type,
                                    value: value[map.key]
                                });
                                await setHistory({
                                    featureKey: `${deviceKey}/${map.type}`,
                                    value: value[map.key]
                                });
                            }
                        })
                } else {
                    await set({
                        key: `${deviceKey}/${Constants.featureMap[property]}`,
                        deviceKey,
                        type,
                        value
                    });
                    await setHistory({
                        featureKey: `${deviceKey}/${Constants.featureMap[property]}`,
                        value: value
                    });
                }
            }
        })
}

export default {
    get,
    set,
    saveReport
}