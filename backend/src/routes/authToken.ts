import express, { Request, Response, Router } from 'express';
import { IUser, User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import '../utils/loadEnv';
import logger from '../utils/logger'; // Load environment variables

const JWT_SECRET_KEY: string =
  process.env['JWT_SECRET'] || 'default_secret_key';

const router: Router = express.Router();

// validate token
router.post('/', async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
    const user: IUser | null = await User.findOne({ email: decoded.email });
    if (user) {
      const validUser = await bcrypt.compare(
        decoded.password,
        user.password || '',
      );
      if (validUser) {
        logger.http(`200 ${req.url} - Valid user`);
        return res.status(200).json({
          message: 'Valid user',
          email: decoded.email,
          password: decoded.password,
        });
      } else {
        logger.http(`400 ${req.url} - Invalid user`);
        return res.status(400).json({ message: 'Invalid user' });
      }
    } else {
      logger.http(`400 ${req.url} - User does not exist`);
      return res.status(400).json({ message: 'User does not exist' });
    }
  } catch (error: any) {
    logger.error('Token verification failed due to :', error.message);
    return res.status(500).json({ message: 'Token verification failed' });
  }
});

export default router;
