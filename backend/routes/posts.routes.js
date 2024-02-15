const express = require("express");
const postRouter = express.Router();
const { addBulk, downloadExcel, checkUserPosts } = require("../controllers/posts.controllers")

postRouter.get("/check", checkUserPosts)

postRouter.post("/add", addBulk);

postRouter.get("/download", downloadExcel);

module.exports = { postRouter }