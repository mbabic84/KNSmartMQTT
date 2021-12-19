import pgPool from './pool.js';

async function get() {
    const pgResult = pgPool()
        .query(`SELECT * FROM "devices"`);

    return pgResult.rows;
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
                "data" = EXCLUDED."data" || '${JSON.stringify(data)}'::JSONB,
                "config" = EXCLUDED."config" || '${JSON.stringify(config)}'::JSONB
            RETURNING *
            `
        )

    return pgResult.rows[0];
}

export default {
    get,
    set
}