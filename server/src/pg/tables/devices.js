export default [
    `CREATE TABLE IF NOT EXISTS "devices" (
        "key" TEXT PRIMARY KEY,
        "type" TEXT,
        "data" JSONB,
        "config" JSONB,
        "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
];