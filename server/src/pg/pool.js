import pg from 'pg';

import config from '../config/index.js';

let pool;

export default function () {
    if (!pool) {
        pool = new pg.Pool(config.db);
    }
    return pool;
}