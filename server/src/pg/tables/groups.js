export default [
    `CREATE TABLE IF NOT EXISTS "groups"
    (
        "key" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "index" INT DEFAULT 0,
        "config" JSONB
    )`
]