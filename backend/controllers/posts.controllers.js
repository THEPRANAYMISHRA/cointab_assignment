const { pool } = require("../database/db");
const excelJS = require("exceljs");
const workbook = new excelJS.Workbook();
const worksheet = workbook.addWorksheet("Posts");

const checkUserPosts = (req, res) => {
    const { id } = req.query;
    let sql = `SELECT * FROM posts WHERE userid = ?`;
    pool.getConnection((err, connection) => {
        if (err) {
            return res.json(err)
        }
        connection.query(sql, [id], (err, result) => {
            connection.release();
            if (!result?.length) {
                return res.status(200).send(false);
            } else {
                return res.status(200).send(true);
            }
        }
        )
    })
}

const downloadExcel = (req, res) => {
    const { userId, company } = req.body;


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
                    company: company,
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
}

const addBulk = (req, res) => {
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
}

module.exports = { addBulk, downloadExcel, checkUserPosts }