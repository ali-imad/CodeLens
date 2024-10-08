import express, { Request, Response } from 'express';
import mongoose, { Connection } from 'mongoose';
import cors from 'cors';
import problemRouter from './routes/problem';
import loginRouter from './routes/login';
import registerRouter from './routes/register';
import attemptRouter from './routes/attempt';
import authRouter from './routes/authToken';
import userRouter from './routes/user';
import { User } from './models/User';
import Problem from './models/Problem';
import mockProblems from './sampleProblems';
import path from 'path';

import './utils/loadEnv'; // Load environment variables
import { pingLLM } from './services/llmService';
import logger from './utils/logger';

const app = express();
const PORT: number = parseInt(process.env['PORT'] || '3000');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const uri: string = process.env['MONGODB_URI'] || '';
mongoose.connect(uri);

const connection: Connection = mongoose.connection;

connection.once('open', async () => {
  logger.info('Connected to MongoDB');

  try {
    const existingProblemsCount = await Problem.countDocuments();

    if (existingProblemsCount === 0) {
      for (const mockProblem of mockProblems) {
        const { title, difficulty, functionBody, testCases, hints } =
          mockProblem;
        const newProblem = new Problem({
          // create a new problem object
          title,
          difficulty,
          functionBody,
          testCases,
          hints,
        });
        await newProblem.save(); // save the problem object by passing it into the Mongoose constructor
      }
      logger.info('All problems inserted successfully.');
    } else {
      logger.info(
        'Problems already exist in the database. Skipping insertion.',
      );
    }
    setTimeout(() => {
      pingLLM(); // prepare the LLM engine
    }, 10000);
  } catch (error) {
    logger.error('Error inserting problems:', error);
  }
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to CodeLens API');
});

app.get('/email/:email', async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.http(`404 ${req.url} - User not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    logger.http(`200 ${req.url} - User found`);
    return res.status(200).json(user);
  } catch (err) {
    logger.http(`500 ${req.url} - Failed to fetch user`);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
});

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/problems', problemRouter);
app.use('/attempts', attemptRouter);
app.use('/authToken', authRouter);
app.use('/users', userRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

export default app;
