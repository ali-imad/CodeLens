import express, { Request, Response } from "express";
import mongoose, { Connection } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import problemRouter from "./routes/problem";
import Problem, { IProblem } from "./models/Problem";
import mockProblems from "./sampleProblems";
import loginRouter from "./routes/login";
import registerRouter from "./routes/register";
import attemptRouter from "./routes/attempt";
import { User } from "./models/User";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env["PORT"] || "3000");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        const { title, difficulty, functionBody, testCases } = mockProblem;
        const newProblem: IProblem = new Problem({
          title,
          difficulty,
          functionBody,
          testCases,
        });
        await newProblem.save();
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

app.get("/email/:email", async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/problems", problemRouter);
app.use("/attempts", attemptRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
