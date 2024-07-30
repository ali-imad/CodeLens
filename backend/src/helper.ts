import mongoose from 'mongoose';

export const connectToDb = async () => {
  const uri: string = process.env['MONGODB_URI'] || '';

  await mongoose
    .connect(uri)
    .then(() => {
      console.log('MONGODB: connected for testing');
    })
    .catch(error => {
      console.error('Error connecting to MongoDB for testing', error);
    });
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};
