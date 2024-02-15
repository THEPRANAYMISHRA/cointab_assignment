const express = require("express");
const userRouter = express.Router()
const { addUserToDatabase, getUser } = require("../controllers/users.controllers")

userRouter.get("/", getUser)

userRouter.post("/", addUserToDatabase)

module.exports = { userRouter };