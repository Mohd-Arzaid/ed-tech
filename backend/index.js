import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// middlewares

// parse the incoming request data in JSON format
app.use(express.json());

// parse the cookies in Js Object
app.use(cookieParser());

app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "Server is up and running ...",
  })
);

// Api's
app.use("/api/v1/auth",userRoute);

app.listen(PORT, async () => {
  connectDb();
  console.log(`Server is running at port ${PORT}`);
});
