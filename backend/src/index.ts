import express, { Request, Response } from "express";
import mongoose, { Connection } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import problemRouter from "./routes/problemRoutes";
import Problem, { IProblem } from "./models/Problem";
import mockProblems from "./sampleProblems";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env["PORT"] || "3000");

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const uri: string = process.env["MONGODB_URI"] || "";
mongoose.connect(uri);

const connection: Connection = mongoose.connection;
connection.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    const existingProblemsCount = await Problem.countDocuments();

    if (existingProblemsCount === 0) {
      for (const mockProblem of mockProblems) {
        const { title, difficulty, functionBody } = mockProblem;
        const newProblem: IProblem = new Problem({
          title,
          difficulty,
          functionBody,
        });
        await newProblem.save();
        console.log(`Inserted problem: ${title}`);
      }

      console.log("All problems inserted successfully.");
    } else {
      console.log(
        "Problems already exist in the database. Skipping insertion."
      );
    }
  } catch (error) {
    console.error("Error inserting problems:", error);
  }
});

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to CodeLens API");
});

app.use("/problems", problemRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
