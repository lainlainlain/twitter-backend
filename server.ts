import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { UserCtrl } from './controllers/UserController';
import { registerValidations } from './validations/validator';

import './core/db';

const app = express();

app.use(express.json());

app.get('/users', UserCtrl.index);
app.post('/users', registerValidations, UserCtrl.create);
app.get('/users/verify', registerValidations, UserCtrl.verify);
// app.get('/users', UserCtrl.put);
// app.get('/users', UserCtrl.delete);

app.listen(8888);
