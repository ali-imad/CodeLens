import express, { Router, Request, Response } from "express";
import Problem, { IProblem } from "../models/Problem";

const router: Router = express.Router();

// Retrieve all problems
router.get("/", async (_req: Request, res: Response) => {
  try {
    const problems: IProblem[] = await Problem.find();
    res.json(problems);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a specific problem by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const problemId: string | undefined = req.params["id"];
    const problem: IProblem | null = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.json(problem);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create a new problem
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, difficulty, functionBody } = req.body;
    const newProblem: IProblem = new Problem({
      title,
      difficulty,
      functionBody,
    });
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing problem
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const problemId: string | undefined = req.params["id"];
    const { title, difficulty, functionBody } = req.body;
    const updatedProblem: IProblem | null = await Problem.findByIdAndUpdate(
      problemId,
      { title, difficulty, functionBody },
      { new: true }
    );
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.json(updatedProblem);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete a problem
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const problemId: string | undefined = req.params["id"];
    const deletedProblem: IProblem | null = await Problem.findByIdAndDelete(
      problemId
    );
    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.json({ message: "Problem deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
