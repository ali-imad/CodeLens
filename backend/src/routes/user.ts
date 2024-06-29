import { Request, Response } from 'express';
import express, { Router } from 'express';
import { IUser, User } from '../models/User';

const router: Router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/students', async (_req: Request, res: Response) => {
  try {
    const students = await User.find({ role: 'Student' }, 'username');
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get(
  '/students/by-instructor/:instructorId',
  async (req: Request, res: Response) => {
    try {
      const { instructorId } = req.params;

      const students = await User.find({
        instructor: instructorId,
        role: 'Student',
      });

      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);

router.get('/instructors', async (_req: Request, res: Response) => {
  try {
    const instructors = await User.find({ role: 'Instructor' }, 'username');
    res.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/select-instructor', async (req: Request, res: Response) => {
  const { userId, instructorId } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { instructor: instructorId },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error setting instructor:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
