const { pool } = require("../database/db");

const getUser = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.json(err);
        }

        connection.query("SELECT * FROM employees", (err, result) => {
            connection.release();
            if (err) {
                return res.json(err);
            } else {
                return res.json(result);
            }
        });
    }
    )
}

const addUserToDatabase = (req, res) => {
    const body = req.body;

    let data = { id: body.id, name: body.name, email: body.email, phone: body.phone, city: body.address.city, website: body.website, company: body.company.name }

    let sql = `INSERT INTO employees (id, name, email, phone, website, city, company) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let values = [+data.id, data.name, data.email, data.phone, data.website, data.city, data.company];

    pool.getConnection((err, connection) => {
        if (err) {
            return res.json(err);
        } else {
            connection.query(sql, [values], (err, result) => {
                connection.release();
                if (err) {
                    return res.json(err);
                } else {
                    console.log(result);
                    return res.json(result);
                }
            });
        }
    })
}

module.exports = { addUserToDatabase, getUser }