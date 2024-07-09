import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attempt, { IAttempt } from '../models/Attempt';
import Problem from '../models/Problem';
import { runTests } from '../services/testCase';
import {
  ANNOTATE_TAG,
  callLLM,
  CODEGEN_TAG,
  LLMContext,
} from '../services/llmService';

const router = express.Router();

interface AttemptResponse {
  attempt: IAttempt;
  history: LLMContext[] | undefined;
}

// Constants for cleaning generated code
const START_TOKEN = '[[[START]]]';
const END_TOKEN = '[[[END]]]';

function cleanGenCode(
  generatedFunction: string,
  start_token: string,
  end_token: string,
) {
  const start = generatedFunction.indexOf(start_token);
  const end = generatedFunction.indexOf(end_token);
  generatedFunction = generatedFunction
    .substring(start, end)
    .replace(start_token, '')
    .replace(end_token, '');
  return generatedFunction.trim();
}

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

    const prompt = `${CODEGEN_TAG} ${description}`;

    const promptResp = await callLLM(prompt, []);
    let generatedFunction = promptResp.response;
    if (generatedFunction) {
      if (
        generatedFunction.includes(START_TOKEN) &&
        generatedFunction.includes(END_TOKEN)
      ) {
        generatedFunction = cleanGenCode(
          generatedFunction,
          START_TOKEN,
          END_TOKEN,
        );
      }
    } else {
      // return placeholder function
      generatedFunction = `function hello() { return "Hello, World!"; }`;
    }

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

    const response: AttemptResponse = {
      attempt: savedAttempt,
      history: promptResp.context,
    };

    return res.status(201).json(response);
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

router.post('/:id/annotate', async (req: Request, res: Response) => {
  // Find the attempt by id
  const { id } = req.params;

  // Get the LLM history
  const history = req.body.history;
  try {
    if (typeof id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid attempt id format' });
    }

    let attempt = await Attempt.findById(id);

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    const promptResp = await callLLM(ANNOTATE_TAG, history);
    let generatedFunction = promptResp.response;
    if (generatedFunction) {
      // Check for the bug
      if (
        generatedFunction.includes(START_TOKEN) &&
        generatedFunction.includes(END_TOKEN)
      ) {
        generatedFunction = cleanGenCode(
          generatedFunction,
          START_TOKEN,
          END_TOKEN,
        );
      }
    } else {
      return res.status(403).json({ message: 'Attempt not annotated' });
    }

    return res.json({ response: generatedFunction, history: history });
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
