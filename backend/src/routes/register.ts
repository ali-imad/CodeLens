import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';
import express, { Router } from 'express';
import logger from '../utils/logger';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, firstName, lastName, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (!Object.values(UserRole).includes(role)) {
      logger.http(`400 ${req.url} - Invalid user role.`);
      return res.status(400).json({ error: 'Invalid user role.' });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User already exists with this email.' });
    }

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password,
      role,
    });
    await newUser.save();

    logger.http(`201 ${req.url} - New User Registered Successfully.`);
    return res.status(201).json({
      message: 'New User Registered Successfully.',
      id: newUser._id,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    logger.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
