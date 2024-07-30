import { connectToDb, disconnectDB } from '../../../src/helper';
import { expect, use } from 'chai';
import 'mocha';
import { User, IUser, UserRole } from '../../../src/models/User';
import app from '../../../src/index';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

const chai = use(chaiHttp);

const existingUserInstructor = {
  _id: new mongoose.Types.ObjectId('86cd799439011507f1f77bc2'),
  username: 'existing-user-instructor',
  firstName: 'existing-user',
  lastName: 'instructor',
  email: 'existing-user-instructor@gmail.com',
  password: 'existing-user-instructor-password',
  role: UserRole.Instructor,
};

const existingUserStudent = {
  _id: new mongoose.Types.ObjectId('86cd799439011507f1f77bc1'),
  username: 'existing-user-student',
  firstName: 'existing-user',
  lastName: 'student',
  email: 'existing-user-student@gmail.com',
  password: 'existing-user-student-password',
  role: UserRole.Student,
  instructor: null,
  assignedProblems: [],
  attemptedProblems: [],
  completedProblems: [],
};

describe('User Route Integration Test', () => {
  before(async () => {
    await connectToDb();
    await mongoose.connection.dropDatabase();
    await User.create(existingUserStudent);
    await User.create(existingUserInstructor);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await disconnectDB();
  });

  describe('/GET route testing', () => {
    describe('Run this test first', () => {
      it('Should fetch all users - two users in DB (before hook) - return ', done => {
        User.create(existingUserStudent);
        chai
          .request(app)
          .get('/users')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.not.null;
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.lengthOf(2);

            const studentUser = res.body.find(
              (user: IUser) => user._id === existingUserStudent._id.toString(),
            );

            expect(studentUser).to.have.property(
              'username',
              existingUserStudent.username,
            );
            expect(studentUser).to.have.property(
              'firstName',
              existingUserStudent.firstName,
            );
            expect(studentUser).to.have.property(
              'lastName',
              existingUserStudent.lastName,
            );
            expect(studentUser).to.have.property(
              'email',
              existingUserStudent.email,
            );
            expect(studentUser).to.have.property(
              'role',
              existingUserStudent.role,
            );

            const instructorUser = res.body.find(
              (user: IUser) =>
                user._id === existingUserInstructor._id.toString(),
            );

            expect(instructorUser).to.have.property(
              'username',
              existingUserInstructor.username,
            );
            expect(instructorUser).to.have.property(
              'firstName',
              existingUserInstructor.firstName,
            );
            expect(instructorUser).to.have.property(
              'lastName',
              existingUserInstructor.lastName,
            );
            expect(instructorUser).to.have.property(
              'email',
              existingUserInstructor.email,
            );
            expect(instructorUser).to.have.property(
              'role',
              existingUserInstructor.role,
            );
            done();
          });
      });
    });

    describe('Now run these cases', () => {
      it('Should fetch all students - one student in DB (before hook)', done => {
        chai
          .request(app)
          .get('/users/students')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.not.null;
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.lengthOf(1);

            const studentUser = res.body.find((user: IUser) => {
              return user._id === existingUserStudent._id.toString();
            });

            expect(studentUser).to.have.property(
              'username',
              existingUserStudent.username,
            );
            expect(studentUser).to.have.property(
              'firstName',
              existingUserStudent.firstName,
            );
            expect(studentUser).to.have.property(
              'lastName',
              existingUserStudent.lastName,
            );
            expect(studentUser).to.have.property(
              'email',
              existingUserStudent.email,
            );
            expect(studentUser).to.have.property(
              'role',
              existingUserStudent.role,
            );
            done();
          });
      });

      it('Should not assign instructor to student - student not instructor in DB - return 404', done => {
        const userNotinDb = {
          _id: new mongoose.Types.ObjectId('86cd799439011507f1f77bc7'),
        };

        chai
          .request(app)
          .put('/users/select-instructor')
          .send({ userId: userNotinDb, instructorId: existingUserInstructor })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.not.null;
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error', 'User not found');
            done();
          });
      });

      it('Should assign instructor to student - one student one instructor in DB - return 200', done => {
        chai
          .request(app)
          .put('/users/select-instructor')
          .send({
            userId: existingUserStudent,
            instructorId: existingUserInstructor,
          })
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.not.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property(
              '_id',
              existingUserStudent._id.toString(),
            );
            expect(res.body).to.have.property(
              'username',
              existingUserStudent.username,
            );
            expect(res.body).to.have.property(
              'firstName',
              existingUserStudent.firstName,
            );
            expect(res.body).to.have.property(
              'lastName',
              existingUserStudent.lastName,
            );
            expect(res.body).to.have.property(
              'email',
              existingUserStudent.email,
            );
            expect(res.body).to.have.property('role', existingUserStudent.role);
            // user updated with instructor
            expect(res.body).to.have.property(
              'instructor',
              existingUserInstructor._id.toString(),
            );
            done();
          });
      });

      it('Should fetch student profile by username - student should have instructor assigned in last test) - return 200', done => {
        chai
          .request(app)
          .get(`/users/students/${existingUserStudent.username}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.not.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property(
              '_id',
              existingUserStudent._id.toString(),
            );
            expect(res.body).to.have.property(
              'username',
              existingUserStudent.username,
            );
            expect(res.body).to.have.property(
              'firstName',
              existingUserStudent.firstName,
            );
            expect(res.body).to.have.property(
              'lastName',
              existingUserStudent.lastName,
            );
            expect(res.body).to.have.property(
              'email',
              existingUserStudent.email,
            );
            expect(res.body).to.have.property('role', existingUserStudent.role);
            expect(res.body).to.have.property(
              'instructor',
              existingUserInstructor._id.toString(),
            );
            done();
          });
      });

      it('Should not fetch any students profile by username - userID not in DB - return 404', done => {
        chai
          .request(app)
          .get(`/users/students/${'invalid-userID'}`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.not.null;
            expect(res.body).to.be.an('object');
            expect(res).to.have.status(404);
            expect(res.body).to.be.property('message', 'Student not found');
            done();
          });
      });

      it('Should fetch student by instructor ID - one student one instructor in DB - return 200', done => {
        chai
          .request(app)
          .get(
            `/users/students/by-instructor/${existingUserInstructor._id.toString()}`,
          )
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.not.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');

            const student = res.body.find((user: IUser) => {
              return user._id === existingUserStudent._id.toString();
            });

            expect(student).to.have.property(
              'username',
              existingUserStudent.username,
            );
            expect(student).to.have.property(
              'firstName',
              existingUserStudent.firstName,
            );
            expect(student).to.have.property(
              'lastName',
              existingUserStudent.lastName,
            );
            expect(student).to.have.property(
              'email',
              existingUserStudent.email,
            );
            expect(student).to.have.property('role', existingUserStudent.role);
            expect(student).to.have.property(
              'instructor',
              existingUserInstructor._id.toString(),
            );
            done();
          });
      });

      it('Should fetch all instructors - one instructor in DB (before hook) - return ', done => {
        chai
          .request(app)
          .get('/users/instructors')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.be.not.null;
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.lengthOf(1);

            const instructorUser = res.body.find((user: IUser) => {
              return user._id === existingUserInstructor._id.toString();
            });

            expect(instructorUser).to.have.property(
              'username',
              existingUserInstructor.username,
            );
            expect(instructorUser).to.have.property(
              'firstName',
              existingUserInstructor.firstName,
            );
            expect(instructorUser).to.have.property(
              'lastName',
              existingUserInstructor.lastName,
            );
            expect(instructorUser).to.have.property(
              'email',
              existingUserInstructor.email,
            );
            done();
          });
      });
    });
  });
  describe('/POST route testing', async () => {
    describe('Run these tests first for upload image route', async () => {
      it('Should fail upload of user image - over sized image - return 400', done => {
        const filePath = path.join(
          __dirname,
          '../../images/over-sized-image.jpg',
        );
        chai
          .request(app)
          .post(`/users/${existingUserStudent.username}/uploadImage`)
          .field('username', existingUserStudent.username)
          .attach('image', filePath)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            expect(res.body).to.have.property(
              'message',
              'File is too large. Maximum allowed size is 5MB.',
            );
            done();
          });
      });

      it('Should fail to upload user image - invalid format/ csv - return 500', done => {
        const filePath = path.join(__dirname, '../../images/avatar.csv');
        chai
          .request(app)
          .post(`/users/${existingUserStudent.username}/uploadImage`)
          .field('username', existingUserStudent.username)
          .attach('image', filePath)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(500);
            expect(res.body).to.have.property(
              'message',
              'The file you attempted to upload is not in a supported image format. We currently accept the following image formats: PNG, JPEG, WebP and SVG.',
            );
            done();
          });
      });

      it('Should fail to upload user image - missing user name - return 500', done => {
        const filePath = path.join(__dirname, '../../images/avatar.jpg');
        chai
          .request(app)
          .post(`/users/${existingUserStudent.username}/uploadImage`)
          .field('username', '')
          .attach('image', filePath)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(500);
            expect(res.body).to.have.property(
              'message',
              'User name is required.',
            );
            done();
          });
      });

      it('Should fail to upload user image - missing file - return 500', done => {
        chai
          .request(app)
          .post(`/users/${existingUserStudent.username}/uploadImage`)
          .field('username', existingUserStudent.username)
          .attach('image', '')
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(500);
            expect(res.body).to.have.property('message', 'No file to upload');
            done();
          });
      });
    });

    describe('Run this test to upload and fetch image', async () => {
      it('Should upload an image to DB - return 200', done => {
        const filePath = path.join(__dirname, '../../images/avatar.jpg');
        chai
          .request(app)
          .post(`/users/${existingUserStudent.username}/uploadImage`)
          .field('username', existingUserStudent.username)
          .attach('image', filePath)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property(
              'message',
              'Profile picture uploaded successfully!',
            );
            expect(res.body)
              .to.have.property('uploadedFile')
              .that.is.an('object');
            expect(res.body.uploadedFile).to.have.property('id');
            expect(res.body.uploadedFile).to.have.property(
              'fieldname',
              'image',
            );
            expect(res.body.uploadedFile).to.have.property(
              'originalname',
              'avatar.jpg',
            );

            expect(res.body.uploadedFile).to.have.property('buffer').that.is.not
              .null;

            // compare buffers: read original file and convert to buffer using fs.readFile;
            // change fetched buffer to base64 format using Buffer.from
            fs.readFile(filePath, (err, orginalFileBuffer) => {
              if (!err) {
                const fetchedBuffer = Buffer.from(
                  res.body.uploadedFile.buffer,
                  'base64',
                );

                expect(orginalFileBuffer.equals(fetchedBuffer)).to.be.true;
              }
            });
            done();
          });
      });

      it('Should fetch the user image from DB  - return 200', done => {
        chai
          .request(app)
          .get(`/users/${existingUserStudent.username}/fetchImage`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });

      it('Should fail to fetch the user image from DB  - no image exist for user in DB - return 404', done => {
        chai
          .request(app)
          .get(`/users/${existingUserInstructor.username}/fetchImage`)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'File not found');
            done();
          });
      });
    });
  });
});
