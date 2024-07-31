import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attempt, { IAttempt } from '../models/Attempt';
import Problem from '../models/Problem';
import {
  ANNOTATE_TAG,
  callLLM,
  CODEGEN_TAG,
  LLMChatResponse,
  LLMContext,
  pingLLM,
} from '../services/llmService';
import {
  cleanGenCodeWithToken,
  cleanGenCodeNoToken,
  END_TOKEN,
  START_TOKEN,
} from '../utils/codeGen';
import { runTests } from '../services/testCase';
import logger from '../utils/logger';
import { User } from '../models/User';

const router = express.Router();
let cleanGenCode = (code: string) => cleanGenCodeNoToken(code);

if (process.env['MODEL_NAME'] !== 'codegeneval-llama3') {
  cleanGenCode = (code: string) =>
    cleanGenCodeWithToken(code, START_TOKEN, END_TOKEN);
}

interface AttemptResponse {
  attempt: IAttempt;
  history: LLMContext[] | undefined;
}

router.post('/', async (req: Request, res: Response) => {
  const { problemId, userId, description, timeTaken } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(problemId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      logger.http(`400 ${req.url} - Invalid ObjectId format`);
      return res.status(400).json({ message: 'Invalid ObjectId format' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      logger.http(`404 ${req.url} - Problem not found`);
      return res.status(404).json({ message: 'Problem not found' });
    }

    const prompt = `${CODEGEN_TAG} ${description}`;

    // check if llm route is awake
    const llmIsAwake = await pingLLM();
    let promptResp: LLMChatResponse = {
      response: `function hello() { return "Hello, World!"; }`,
    };
    if (llmIsAwake) {
      promptResp = await callLLM(prompt, []);
    }
    let generatedFunction = promptResp.response;
    if (generatedFunction) {
      if (
        generatedFunction.includes(START_TOKEN) &&
        generatedFunction.includes(END_TOKEN)
      ) {
        generatedFunction = cleanGenCodeWithToken(
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
      timeTaken: timeTaken, // in milliseconds
    };

    const newAttempt = new Attempt(newAttemptData);
    const savedAttempt = await newAttempt.save();
    await savedAttempt.updateUserProgress();

    const response: AttemptResponse = {
      attempt: savedAttempt,
      history: promptResp.context,
    };

    logger.http(`201 ${req.url} - Attempt created`);
    return res.status(201).json(response);
  } catch (err: any) {
    logger.http(`500 ${req.url} - ${err.message}`);
    return res.status(500).json({ message: err.message });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const attempts = await Attempt.find();
    res.json(attempts);
  } catch (err: any) {
    logger.http(`500 ${_req.url} - ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// get all attempts from a user
router.get('/:userID', async (req: Request, res: Response) => {
  const { userID } = req.params;

  try {
    if (
      !userID ||
      typeof userID === 'undefined' ||
      !mongoose.Types.ObjectId.isValid(userID)
    ) {
      logger.http(`400 ${req.url} - Invalid ObjectId format`);
      return res.status(400).json({ message: 'Invalid ObjectId format' });
    }
    const user = await User.findById(userID);

    if (!user) {
      logger.http(`404 ${req.url} - User not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    logger.debug(user);

    const attempts = await Attempt.find({
      userId: new mongoose.Types.ObjectId(userID),
    });
    logger.http(`200 ${req.url} - Attempts found`);
    return res.json(attempts);
  } catch (err: any) {
    logger.http(`500 ${req.url} - ${err.message}`);
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
      logger.http(`400 ${req.url} - Invalid attempt id format`);
      return res.status(400).json({ message: 'Invalid attempt id format' });
    }

    let attempt = await Attempt.findById(id);

    if (!attempt) {
      logger.http(`404 ${req.url} - Attempt not found`);
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
        generatedFunction = cleanGenCode(generatedFunction);
      }
    } else {
      logger.http(`403 ${req.url} - Attempt not annotated`);
      return res.status(403).json({ message: 'Attempt not annotated' });
    }

    logger.http(`200 ${req.url} - Attempt annotated`);
    return res.json({ response: generatedFunction, history: history });
  } catch (err: any) {
    logger.http(`500 ${req.url} - ${err.message}`);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
