import pgPool from './pool.js';

async function get() {
    const pgResult = await pgPool()
        .query(`SELECT * FROM "groups"`);

    return pgResult.rows;
}

async function set({ key, name, index, config = {} }) {
    const pgResult = await pgPool()
        .query(
            `INSERT INTO "groups" (
                "key",
                "name",
                "index",
                "config"
            ) VALUES (
                '${key}',
                '${name}',
                '${index}',
                '${JSON.stringify(config)}'
            ) ON CONFLICT ("key") DO UPDATE SET
                "config" = "groups"."config" || '${JSON.stringify(config)}'::JSONB
            RETURNING *
            `
        )

    return pgResult.rows[0];
}

async function del(key) {
    const pgResult = await pgPool()
        .query(`DELETE FROM "groups" WHERE "key" = '${key}'`);

    return !!pgResult.rowCount;
}

export default {
    get,
    set,
    del
}