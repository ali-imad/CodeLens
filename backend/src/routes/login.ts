import express, { Request, Response, Router } from 'express';
import { IUser, User } from '../models/User';
import bcrypt from 'bcrypt';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required.' });
    }

    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password || '');
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    return res.status(200).json({
      message: 'Login successful.',
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
