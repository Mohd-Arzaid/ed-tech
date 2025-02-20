import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "Server is up and running ...",
  })
);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
