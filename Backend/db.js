//Import the "Pool" object from the pg (node-postgres) module
//Pool is used to create pool of connections to PostgreSQL so you can reuse existing connections
const Pool = require("pg").Pool;

//create connection saved as object "pool"
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

//Use the export module to export the pool object so other files can use this object
//exports is a default module in all Node.js files
module.exports = pool;