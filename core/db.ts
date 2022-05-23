import mongoose from 'mongoose';

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/twitter');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'conneection error'));

export { db, mongoose };
