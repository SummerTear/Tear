import mongoose from 'mongoose';
import { dbConfig } from '../config';

mongoose.Promise = global.Promise;

export const MongooseConnection = mongoose
  .connect(dbConfig.uri, dbConfig.options)
  .catch(connectError => {
    console.error('Could not connect to MongoDB', connectError);
  });

export User from './schema/user';
