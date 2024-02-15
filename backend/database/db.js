const mysql = require("mysql");
require("dotenv").config();

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.Host,
    port: process.env.Port,
    user: process.env.Database_user,
    database: process.env.Database_name,
    password: process.env.Database_password
});

module.exports = { pool };

