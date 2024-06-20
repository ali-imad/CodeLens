import { Request, Response } from "express";
import { User } from "../models/User";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email." });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
