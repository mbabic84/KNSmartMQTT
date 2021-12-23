import pgPool from './pool.js';

async function get() {
    const pgResult = await pgPool()
        .query(
            `SELECT 
                to_jsonb("fc") - '{"deviceKey", "config"}'::text[] 
                || jsonb_build_object('device', to_jsonb("fcd") - '{"data", "config", "created"}'::text[]) 
                    AS "current",
                to_jsonb("fsp") - '{"deviceKey", "config"}'::text[] 
                || jsonb_build_object('device', to_jsonb("fspd") - '{"data", "config", "created"}'::text[]) AS "setpoint",
                to_jsonb("fh") - '{"deviceKey", "config"}'::text[] 
                || jsonb_build_object('device', to_jsonb("fhd") - '{"data", "config", "created"}'::text[]) AS "handler"
            FROM 
                "rules" AS "r" 
            LEFT JOIN 
                "features" AS "fc" ON "r"."current" = "fc"."key"
            LEFT JOIN 
                "features" AS "fsp" ON "r"."setpoint" = "fsp"."key"
            LEFT JOIN 
                "features" AS "fh" ON "r"."handler" = "fh"."key"
            LEFT JOIN
                "devices" AS "fcd" ON "fc"."deviceKey" = "fcd"."key"
            LEFT JOIN
                "devices" AS "fspd" ON "fsp"."deviceKey" = "fspd"."key"
            LEFT JOIN
                "devices" AS "fhd" ON "fh"."deviceKey" = "fhd"."key"`
        )

    return pgResult.rows;
}

async function set({ key, type, current, setpoint, handler, config = {} }) {
    const pgResult = await pgPool()
        .query(
            `INSERT INTO "rules" (
                "key"
                "type",
                "current",
                "setpoint",
                "handler",
                "config"
            ) VALUES (
                '${key}',
                '${type}',
                '${current}',
                '${setpoint}',
                '${handler}',
                '${config}'
            ) ON CONFLICT (key) DO UPDATE SET
                "type" = '${type}',
                "current" = '${current}',
                "setpoint" = '${setpoint}',
                "handler" = '${handler}',
                "config" = "rules"."config" || '${config}'::JSONB
            RETURNING *`
        )

    return pgResult.rows[0];
}

async function del(key) {
    const pgResult = await pgPool()
        .query(`DELETE FROM "rules" WHERE "key" = '${key}'`);

    return !!pgResult.rowCount;
}

export default {
    get,
    set
}