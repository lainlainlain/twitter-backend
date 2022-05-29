import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validations/validator';

import './core/db';
import { passport } from './core/passport';

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get('/users', UserCtrl.index);
app.get('/users/:id', registerValidations, UserCtrl.show);
app.get('/auth/verify', registerValidations, UserCtrl.verify);
app.post('/auth/register', registerValidations, UserCtrl.create);
app.post('/auth/login', passport.authenticate('local'), function (req, res) {
  res.json(req.user);
});

app.listen(8888);
