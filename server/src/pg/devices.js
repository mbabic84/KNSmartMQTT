import pgPool from './pool.js';

async function getByKey(key) {
    const pgResult = await pgPool()
        .query(`SELECT * FROM "devices" WHERE "key" = '${key}'`);

    return pgResult.rows[0];
}

async function getAll() {
    const pgResult = await pgPool()
        .query(`SELECT * FROM "devices"`);

    return pgResult.rows;
}

async function get(key) {
    if (!key) {
        return getAll();
    } else {
        return getByKey(key);
    }
}

async function set({ key, type, data = {}, config = {} }) {
    const pgResult = await pgPool()
        .query(
            `INSERT INTO "devices" (
                "key",
                "type",
                "data",
                "config"
            ) VALUES (
                '${key}',
                '${type}',
                '${JSON.stringify(data)}',
                '${JSON.stringify(config)}'
            ) ON CONFLICT ("key") DO UPDATE SET
                "data" = "devices"."data" || '${JSON.stringify(data)}'::JSONB,
                "config" = "devices"."config" || '${JSON.stringify(config)}'::JSONB
            RETURNING *
            `
        )

    return pgResult.rows[0];
}

export default {
    get,
    set
}