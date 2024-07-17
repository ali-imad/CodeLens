import { Request, Response, NextFunction } from 'express';
import express, { Router } from 'express';
import { IUser, User } from '../models/User';
import mime from 'mime-types';
import mongoose from 'mongoose';
import multer from 'multer';
import sharp from 'sharp';
import logger from '../utils/logger';

const router: Router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find();
    return res.json(users);
  } catch (err) {
    logger.error('Failed to fetch users:', err);
    logger.http(`500 ${_req.url} - Failed to fetch users`)
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/students', async (_req: Request, res: Response) => {
  try {
    const students = await User.find({ role: 'Student' });
    return res.json(students);
  } catch (error) {
    logger.error('Error fetching students:', error);
    logger.http(`500 ${_req.url} - Error fetching students`)
    return res.status(500).json({ error: 'Error fetching students' });
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
      logger.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
);

router.get('/instructors', async (_req: Request, res: Response) => {
  try {
    const instructors = await User.find({ role: 'Instructor' }, 'username');
    res.json(instructors);
  } catch (error) {
    logger.error('Error fetching instructors:', error);
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
      logger.http(`404 ${req.url} - User not found`)
      return res.status(404).json({ error: 'User not found' });
    }

    logger.http(`200 ${req.url} - Instructor selected successfully!`)
    return res.status(200).json(updatedUser);
  } catch (error) {
    logger.error('Error setting instructor:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Fetching the initial user profile image if exists in database .

router.get(
  '/:userName/fetchImage',
  async (req: Request, res: Response): Promise<void> => {
    const { userName } = req.params;

    try {
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'uploadedImages',
      });

      const file = await bucket.find({ 'metadata.id': userName }).next();

      if (!file) {
        res.status(404).send('File not found');
        return;
      }

      // convert filename to ascii standard format
      logger.debug(`Encoding display picture filename: ${file.filename}`);
      const filename = encodeURIComponent(file.filename);

      const contentType =
        mime.lookup(file.filename) || 'application/octet-stream';

      res.set('Content-Type', contentType);
      res.set('Content-Disposition', `inline; filename="${filename}"`);

      const downloadStream = bucket.openDownloadStream(file._id);

      return new Promise<void>((resolve, reject) => {
        downloadStream.on('error', error => {
          logger.error('Error streaming file:', error);
          if (!res.headersSent) {
            res.status(500).send('An error occurred while streaming the file');
          }
          reject(error);
        });

        downloadStream.pipe(res);

        res.on('finish', () => {
          resolve();
        });

        res.on('close', () => {
          downloadStream.destroy();
          resolve();
        });
      });
    } catch (error) {
      logger.error('Error fetching file:', error);
      if (!res.headersSent) {
        res.status(500).send('Failed to fetch file');
      }
      return Promise.resolve();
    }
  },
);

// Uploading the user image after processing, to the DB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'The file you attempted to upload is not in a supported image format. We currently accept the following image formats: PNG, JPEG, WebP and SVG.',
        ),
      );
    }
  },
});

async function processAndUploadImage(
  file: Express.Multer.File,
  userName: string,
): Promise<mongoose.mongo.ObjectId> {
  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'uploadedImages',
  });

  const compressedFile = await sharp(file.buffer)
    .resize({ width: 200 })
    .jpeg({ quality: 75 })
    .toBuffer();

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(file.originalname, {
      metadata: { id: userName },
    });

    uploadStream.end(compressedFile);

    uploadStream.on('finish', () => {
      resolve(uploadStream.id);
    });

    uploadStream.on('error', error => {
      reject(error);
    });
  });
}

router.post(
  '/:userName/uploadImage',
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.file) {
        throw new Error('No file to upload');
      }

      const userName = req.body.userName;
      if (!userName) {
        throw new Error('User name is required.');
      }

      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'uploadedImages',
      });

      const existingFile = await bucket
        .find({ 'metadata.id': userName })
        .next();
      if (existingFile) {
        await bucket.delete(existingFile._id);
      }

      const fileId = await processAndUploadImage(req.file, userName);

      await session.commitTransaction();
      session.endSession();

      logger.http(`200 ${req.url} - Profile picture uploaded successfully!`)
      return res.status(200).json({
        message: 'Profile picture uploaded successfully!',
        uploadedFile: { id: fileId, ...req.file },
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      //forward error to next
      next(error);
      return;
    }
  },
);

// Multer doesn’t automatically pass error through the usual middleware error-handling mechanisms
// (.json => doesn't make json object). Multer error needs explicit handling.
// Error handling middleware: exxpress middleware need 4 args and if not used use _before-them
router.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ message: 'File is too large. Maximum allowed size is 5MB.' });
    } else {
      logger.http(`400 ${_req.url} - ${error.message}`)
      return res.status(400).json({ message: error.message });
    }
  } else {
    return res
      .status(500)
      .json({ message: error.message || 'Failed to process uploaded file.' });
  }
});
export default router;
