const mysql = require("mysql");

const conn = mysql.createConnection({
    host: "localhost",
    port: "4505",
    user: "root",
    database: "cointab",
    password: ""
});

module.exports = { conn };
