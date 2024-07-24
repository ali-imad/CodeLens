import express, { Request, Response, Router } from 'express';
import { IUser, User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import '../utils/loadEnv';
import logger from '../utils/logger'; // Load environment variables

const JWT_SECRET_KEY: string =
  process.env['JWT_SECRET'] || 'default_secret_key';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.http(`400 ${req.url} - Email and password are required.`);
      return res
        .status(400)
        .json({ error: 'Email and password are required.' });
    }

    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      logger.http(`400 ${req.url} - Invalid email or password.`);
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password || '');
    if (!validPassword) {
      logger.http(`400 ${req.url} - Invalid email or password.`);
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    // create a token with 2 day life
    const token = jwt.sign(
      { email: email, password: password },
      JWT_SECRET_KEY,
      { expiresIn: 3 * 24 * 60 * 60 },
      // { expiresIn: 2},
    );

    logger.http(`200 ${req.url} - Login successful.`);
    return res.status(200).json({
      message: 'Login successful.',
      token: token,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    logger.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
