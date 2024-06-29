import express, { Request, Response, Router } from 'express';
import { IUser, User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY: string =
  process.env['JWT_SECRET'] || 'default_secret_key';

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
    // create a token with 2 day life
    const token = jwt.sign(
      { email: email, password: password },
      JWT_SECRET_KEY,
      { expiresIn: 3 * 24 * 60 * 60 },
      // { expiresIn: 2},
    );

    return res.status(200).json({
      message: 'Login successful.',
      token: token,
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
