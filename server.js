const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postsRouter");
const dotenv = require("dotenv");
dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Hello",
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
