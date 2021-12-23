export default [
    `CREATE TABLE IF NOT EXISTS "configuration" (
        "key" TEXT PRIMARY KEY,
        "data" JSONB,
        "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
]