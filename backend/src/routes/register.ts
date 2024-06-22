import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';
import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: 'Invalid user role.' });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User already exists with this email.' });
    }

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    return res.status(201).json({
      message: 'New User Registered Successfully.',
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
