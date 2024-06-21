import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attempt, { IAttempt } from '../models/Attempt';
import Problem from '../models/Problem';
import { runTests } from '../services/testCase';
// TODO: Uncomment this line after implementing the LLM service
// import { callLLM } from "../services/llmService";

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { problemId, userId, description } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(problemId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: 'Invalid ObjectId format' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // TODO: implementing the LLM API logic

    // const prompt = `
    // Problem Function Signature:
    // \`\`\`javascript
    // ${problem.functionBody}
    // \`\`\`

    // User Description:
    // "${description}"

    // Test Cases:
    // \`${JSON.stringify(problem.testCases)}\`

    // Instructions:
    // 1. Generate a JavaScript function based on the given problem function signature and user description.
    // 2. Ensure that the function adheres to the signature format provided.
    // 3. Use the given test cases to validate the function’s correctness.
    // 4. Return the generated function as a string.

    // Example Response Format:

    // \`\`\`json
    // {
    //   "generatedFunction": "function add(a, b) { return a + b; }"
    // }
    // \`\`\`
    // `;

    // TODO: uncomment the following line after implementing the LLM API logic
    // const generatedFunction = await callLLM(prompt);

    const generatedFunction = `function twoSum(nums, target) {
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          if (nums[i] + nums[j] === target) {
            return [i, j];
          }
        }
      }
    }`;

    const { passed, feedbackArray } = runTests(
      generatedFunction,
      problem.testCases,
    );

    const newAttemptData: Partial<IAttempt> = {
      problemId: new mongoose.Types.ObjectId(problemId),
      userId: new mongoose.Types.ObjectId(userId),
      description,
      generatedCode: generatedFunction,
      feedback: feedbackArray,
      isPassed: passed,
      createdAt: new Date(),
    };

    const newAttempt = new Attempt(newAttemptData);
    const savedAttempt = await newAttempt.save();

    return res.status(201).json(savedAttempt);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const attempts = await Attempt.find();
    res.json(attempts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/problem/:problemId', async (req: Request, res: Response) => {
  const { problemId } = req.params;

  try {
    if (
      typeof problemId === 'undefined' ||
      !mongoose.Types.ObjectId.isValid(problemId)
    ) {
      return res.status(400).json({ message: 'Invalid problemId format' });
    }

    const attempts = await Attempt.find({
      problemId: new mongoose.Types.ObjectId(problemId),
    });
    return res.json(attempts);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (typeof id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid attempt id format' });
    }

    const attempt = await Attempt.findById(id);
    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    return res.json(attempt);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// PUT update attempt by id
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { generatedCode, feedback, isPassed } = req.body;

  try {
    if (typeof id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid attempt id format' });
    }

    const updatedAttempt = await Attempt.findByIdAndUpdate(
      id,
      { generatedCode, feedback, isPassed },
      { new: true },
    );

    if (!updatedAttempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    return res.json(updatedAttempt);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
