const express = require("express");
const cors = require("cors");
const { pool } = require("./db");
const app = express();
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook();
const worksheet = workbook.addWorksheet("Posts");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
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
})

app.post("/", (req, res) => {
    const body = req.body;

    let data = { id: body.id, name: body.name, email: body.email, phone: body.phone, city: body.address.city, website: body.website, company: body.company.name }

    let sql = `INSERT INTO employees (id,name, email, phone, website, city, company) VALUES(${+data.id},'${data.name}', '${data.email}', '${data.phone}', '${data.website}', '${data.city}', '${data.company}')`;

    pool.getConnection((err, connection) => {
        if (err) {
            return res.json(err);
        } else {
            connection.query(sql, (err, result) => {
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
})

app.get("/check", (req, res) => {
    const { id } = req.query;
    let sql = `SELECT * FROM posts WHERE userid=${id}`;
    pool.getConnection((err, connection) => {
        if (err) {
            return res.json(err)
        }
        connection.query(sql, (err, result) => {
            connection.release();
            if (!result?.length) {
                return res.status(200).send(false);
            } else {
                return res.status(200).send(true);
            }
        }
        )
    })
})

app.post("/add", (req, res) => {
    const { userId, posts } = req.body;
    // Checking for the user existence
    let sql = `SELECT name, company FROM employees WHERE id = ?`;

    pool.getConnection((err, connection) => {
        if (err) {
            return res.json(err)
        } else {
            connection.query(sql, [userId], (err, data) => {
                if (err) {
                    console.error("Error checking user:", err);
                    connection.release();
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                if (!data[0]) {
                    connection.release();
                    return res.status(404).json({ error: "User not found" });
                }
                // User exists, proceed to insert posts
                const user = data[0];
                const { name, company } = user;
                const postValues = posts.map(({ title, body }) => [userId, name, title, company, body]);

                let insertSql = `INSERT INTO posts (userid, name, title, company, body) VALUES ?`;
                connection.query(insertSql, [postValues], (err, result) => {
                    connection.release();
                    if (err) {
                        console.error("Error inserting post:", err);
                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                    console.log("Number of records inserted: " + result.affectedRows);
                    res.status(201).json({ message: "Posts added successfully" });
                });
            });
        }
    })
});

app.get("/download", (req, res) => {
    const { userId } = req.query;

    let sql = `SELECT * FROM posts WHERE userid=?`;

    pool.getConnection((err, connection) => {
        if (err) {
            connection.release();
            return res.json(err)
        } else {
            connection.query(sql, [userId], (err, result) => {
                connection.release();
                if (err) {
                    console.error("Error fetching posts:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                const data = result.map(post => ({
                    id: post.id,
                    uid: post.userid,
                    name: post.name,
                    title: post.title,
                    company: post.company,
                    body: post.body
                }));

                worksheet.columns = [
                    { header: "Id", key: "id", width: 5 },
                    { header: "UserId", key: "uid", width: 5 },
                    { header: "Name", key: "name", width: 10 },
                    { header: "Title", key: "title", width: 25 },
                    { header: "Company", key: "company", width: 5 },
                    { header: "Body", key: "body", width: 30 }
                ];

                // Add data to the worksheet 
                data.forEach(post => { worksheet.addRow(post) });

                // Set up the response headers 
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.setHeader("Content-Disposition", "attachment; filename=Posts.xlsx");

                // Write the workbook to the response object 
                workbook.xlsx.write(res).then(() => res.end());
            });
        }
    })
});


const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})