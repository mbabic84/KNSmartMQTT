export default [
    `CREATE TABLE IF NOT EXISTS "features" (
        "key" TEXT PRIMARY KEY,
        "deviceKey" TEXT REFERENCES "devices" ("key") ON DELETE CASCADE,
        "type" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "config" JSONB,
        "updated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE OR REPLACE FUNCTION features_set_updated()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated = now(); 
            RETURN NEW;
        END;
    $$ language 'plpgsql'`,
    `CREATE OR REPLACE TRIGGER "update_features_updated" BEFORE UPDATE
        ON "features" FOR EACH ROW EXECUTE PROCEDURE 
        features_set_updated()`
];