const mysql = require("mysql");
require("dotenv").config();

const conn = mysql.createConnection({
    host: process.env.Host,
    port: process.env.Port,
    user: process.env.Database_user,
    database: process.env.Database_name,
    password: process.env.Database_password
});

conn.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = { conn };

