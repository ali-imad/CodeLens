import express, { Response } from "express";
import mongoose, { Connection } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import problemRouter from "./routes/problemRoutes";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env["PORT"] || "3000");

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const uri: string = process.env["MONGODB_URI"] || "";
mongoose.connect(uri);

const connection: Connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes
app.get("/", (res: Response) => {
  res.send("Welcome to CodeLens API");
});

app.use("/problems", problemRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
