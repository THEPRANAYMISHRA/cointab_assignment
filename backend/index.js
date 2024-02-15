const express = require("express");
const cors = require("cors");
const app = express();
const { postRouter } = require("./routes/posts.routes")
const { userRouter } = require("./routes/user.routes")

app.use(express.json());
app.use(cors());

app.use("/users", userRouter)

app.use("/posts", postRouter)

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})