export default [
    `CREATE TABLE IF NOT EXISTS "history" (
        "id" SERIAL PRIMARY KEY,
        "featureKey" TEXT REFERENCES "features" ("key"),
        "value" TEXT NOT NULL,
        "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
]