import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Attempt, { IAttempt } from "../models/Attempt";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { problemId, userId, description } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(problemId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    const newAttemptData: Partial<IAttempt> = {
      problemId: new mongoose.Types.ObjectId(problemId),
      userId: new mongoose.Types.ObjectId(userId),
      description,
      generatedCode: "",
      feedback: "",
      isPassed: false,
      createdAt: new Date(),
    };

    const newAttempt = new Attempt(newAttemptData);
    const savedAttempt = await newAttempt.save();

    return res.status(201).json(savedAttempt);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const attempts = await Attempt.find();
    res.json(attempts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/problem/:problemId", async (req: Request, res: Response) => {
  const { problemId } = req.params;

  try {
    if (
      typeof problemId === "undefined" ||
      !mongoose.Types.ObjectId.isValid(problemId)
    ) {
      return res.status(400).json({ message: "Invalid problemId format" });
    }

    const attempts = await Attempt.find({
      problemId: new mongoose.Types.ObjectId(problemId),
    });
    return res.json(attempts);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (typeof id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attempt id format" });
    }

    const attempt = await Attempt.findById(id);
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    return res.json(attempt);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT update attempt by id
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { generatedCode, feedback, isPassed } = req.body;

  try {
    if (typeof id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attempt id format" });
    }

    const updatedAttempt = await Attempt.findByIdAndUpdate(
      id,
      { generatedCode, feedback, isPassed },
      { new: true }
    );

    if (!updatedAttempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    return res.json(updatedAttempt);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
