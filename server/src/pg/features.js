import pgPool from './pool.js';
import Constants from '../Constants.js';
import pgHistory from './history.js';
import socketio from '../socketio/index.js';

async function get() {
    const pgResult = await pgPool()
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
                "value" = '${value}',
                "config" = "features"."config" || '${JSON.stringify(config)}'::JSONB
            RETURNING *`
        )

    return pgResult.rows[0];
}

async function setConfig({ key, config = {} }) {
    const pgResult = await pgPool()
        .query(
            `UPDATE 
                "features" 
            SET
                "config" = "features"."config" || '${JSON.stringify(config)}'::JSONB
            WHERE 
                "key" = '${key}'
            RETURNING *`
        )

    return pgResult.rows[0];
}

async function saveReport(report, deviceKey, device) {
    for (const [property, value] of Object.entries(report)) {
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
                            const key = `${deviceKey}/${map.type}/${map.index}`;
                            const feature = await set({
                                key,
                                deviceKey,
                                type: map.type,
                                value: map.value(value[map.key])
                            });
                            await pgHistory.set({
                                featureKey: key,
                                value: map.value(value[map.key])
                            });
                            socketio.emitFeature(feature);

                        }
                    })
            } else if (
                typeof Constants.featureMap[property] === "object"
                && Constants.featureMap[property].type
                && Constants.featureMap[property].transform
            ) {
                const feature = await set({
                    key: `${deviceKey}/${Constants.featureMap[property].type}`,
                    deviceKey,
                    type: Constants.featureMap[property].type,
                    value: Constants.featureMap[property].transform(value)
                });
                await pgHistory.set({
                    featureKey: `${deviceKey}/${Constants.featureMap[property].type}`,
                    value: Constants.featureMap[property].transform(value)
                });
                socketio.emitFeature(feature);
            } else {
                const feature = await set({
                    key: `${deviceKey}/${Constants.featureMap[property]}`,
                    deviceKey,
                    type,
                    value
                });
                await pgHistory.set({
                    featureKey: `${deviceKey}/${Constants.featureMap[property]}`,
                    value: value
                });
                socketio.emitFeature(feature);
            }
        }
    }
}

export default {
    get,
    set,
    setConfig,
    saveReport
}