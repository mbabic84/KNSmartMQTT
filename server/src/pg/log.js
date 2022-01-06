import pgPool from "./pool.js";

async function set({ type, message }) {
    const pgResult = await pgPool()
        .query(
            `INSERT INTO "log" (
                "type",
                "message"
            ) VALUES (
                '${type}',
                '${message}'
            ) RETURNING "type", "message", "created"`
        )

    return pgResult.rows[0];
}

async function get() {
    const pgResult = await pgPool()
        .query(
            `SELECT 
                "type",
                "message",
                "created"
            FROM 
                "log" 
            ORDER BY 
                "created" DESC
            LIMIT 100`
        )

    return pgResult.rows;
}

export default {
    set,
    get
}