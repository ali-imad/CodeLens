import express, { Router, Request, Response } from 'express';
import Problem, { IProblem } from '../models/Problem';
import { User } from '../models/User';
import mongoose from 'mongoose';

const router: Router = express.Router();

// Retrieve all problems
router.get('/', async (_req: Request, res: Response) => {
  try {
    const problems: IProblem[] = await Problem.find();
    res.json(problems);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a random problem
router.get('/random', async (_req: Request, res: Response) => {
  try {
    const randomProblem: IProblem[] = await Problem.aggregate([
      { $sample: { size: 1 } },
    ]);
    if (randomProblem.length === 0) {
      res.status(404).json({ message: 'No problems found' });
    }
    res.json(randomProblem[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a specific problem by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const problemId: string | undefined = req.params['id'];
    const problem: IProblem | null = await Problem.findById(problemId);
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// get status of the problem
router.get('/status/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const problems = await Problem.find();
    const problemStatus = problems.map(problem => ({
      id: problem._id,
      title: problem.title,
      difficulty: problem.difficulty,
      status: user.completedProblems.includes(
        problem._id as mongoose.Types.ObjectId,
      )
        ? 'Completed'
        : user.attemptedProblems.includes(
            problem._id as mongoose.Types.ObjectId,
          )
        ? 'Attempted'
        : 'Not Attempted',
    }));

    return res.json(problemStatus);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// Assign problems to a student
router.post('/assign', async (req: Request, res: Response) => {
  try {
    const { instructorId, studentId, problemIds } = req.body;

    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'Instructor') {
      return res
        .status(403)
        .json({ message: 'Not authorized to assign problems' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const problemObjectIds = problemIds.map(
      (id: string) => new mongoose.Types.ObjectId(id),
    );

    await User.findByIdAndUpdate(studentId, {
      $addToSet: { assignedProblems: { $each: problemObjectIds } },
    });

    return res.status(200).json({ message: 'Problems assigned successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// Get assigned problems for a student
router.get('/assigned/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('assignedProblems');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      count: user.assignedProblems.length,
      problems: user.assignedProblems,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// Get attempted problems for a user
router.get('/attempted/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('attemptedProblems');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      count: user.attemptedProblems.length,
      problems: user.attemptedProblems,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// Get completed problems for a user
router.get('/completed/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('completedProblems');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      count: user.completedProblems.length,
      problems: user.completedProblems,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// Get all problem statuses for a user
router.get('/status/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const problems = await Problem.find();
    const problemStatus = problems.map(problem => ({
      id: problem._id,
      title: problem.title,
      difficulty: problem.difficulty,
      status: user.completedProblems.includes(
        problem._id as mongoose.Types.ObjectId,
      )
        ? 'Completed'
        : user.attemptedProblems.includes(
            problem._id as mongoose.Types.ObjectId,
          )
        ? 'Attempted'
        : user.assignedProblems.includes(problem._id as mongoose.Types.ObjectId)
        ? 'Assigned'
        : 'Not Assigned',
    }));

    return res.json(problemStatus);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// Create a new problem
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, difficulty, functionBody, testCases } = req.body;
    const newProblem: IProblem = new Problem({
      title,
      difficulty,
      functionBody,
      testCases,
    });
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing problem
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const problemId: string | undefined = req.params['id'];
    const { title, difficulty, functionBody } = req.body;
    const updatedProblem: IProblem | null = await Problem.findByIdAndUpdate(
      problemId,
      { title, difficulty, functionBody },
      { new: true },
    );
    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    return res.json(updatedProblem);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete a problem
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const problemId: string | undefined = req.params['id'];
    const deletedProblem: IProblem | null = await Problem.findByIdAndDelete(
      problemId,
    );
    if (!deletedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    return res.json({ message: 'Problem deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
