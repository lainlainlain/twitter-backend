import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import multer from 'multer';

import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validations/validator';

import './core/db';
import { passport } from './core/passport';
import { TweetsCtrl } from './controllers/TweetController';
import { createTweetValidations } from './validations/tweets';
import { UploadFileCtrl } from './controllers/UploadFileController';

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());
app.use(passport.initialize());

app.get('/users', UserCtrl.index);
app.get('/users/me', passport.authenticate('jwt', { session: false }), UserCtrl.getUserInfo);
app.get('/users/:id', UserCtrl.show);

app.get('/tweets', TweetsCtrl.index);
app.get('/tweets/:id', TweetsCtrl.show);
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetsCtrl.delete);
app.patch('/tweets/:id', passport.authenticate('jwt'), createTweetValidations, TweetsCtrl.update);
app.post('/tweets', passport.authenticate('jwt'), createTweetValidations, TweetsCtrl.create);

app.get('/auth/verify', registerValidations, UserCtrl.verify);
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), UserCtrl.afterLogin);

app.post('/upload', upload.single('avatar'), UploadFileCtrl.upload);

app.listen(8888, (): void => {
  console.log('SERVER IS RUNNING');
});
