export default [
    `CREATE TABLE IF NOT EXISTS "log" (
        "line" SERIAL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
]