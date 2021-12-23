import pgPool from './pool.js';

async function get(key) {
    if (!key) {
        return;
    }

    const pgResult = await pgPool()
        .query(`SELECT "data" FROM "configuration" WHERE "key" = '${key}'`);

    return pgResult.rows?.[0]?.data;
}

async function set({ key, data = {} }) {
    const pgResult = await pgPool()
        .query(
            `INSERT INTO "configuration" (
                "key",
                "data",
            ) VALUES (
                '${key}',
                '${JSON.stringify(data)}'
            ) ON CONFLICT ("key") DO UPDATE SET
                "data" = "configuration"."data" || '${JSON.stringify(data)}'::JSONB
            RETURNING *
            `
        )

    return pgResult.rows[0];
}

export default {
    get,
    set
}