export default [
    `CREATE TABLE IF NOT EXISTS "rules" (
        "key" TEXT PRIMARY KEY,
        "type" TEXT NOT NULL,
        "current" TEXT REFERENCES "features" ("key") ON DELETE CASCADE,
        "setpoint" TEXT REFERENCES "features" ("key") ON DELETE CASCADE,
        "handler" TEXT REFERENCES "features" ("key") ON DELETE CASCADE,
        "config" JSONB,
        "active" BOOL,
        "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("type", "current", "setpoint", "handler")
    )`
]