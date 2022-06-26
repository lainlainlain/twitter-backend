import { UserModel } from '../models/UserModel';
import express from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { generateMD5 } from '../utils/generateHash';
import { sendEmail } from '../utils/sendMail';
import { isValidObjectId } from '../utils/isValidObject';

class UserController {
  async index(_: any, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec();

      res.json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        satus: 'error',
        message: JSON.stringify(error),
      });
    }
  }

  async show(req: any, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findById(userId).exec();

      if (!user) {
        res.status(400).send();
        return;
      }

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        satus: 'error',
        message: JSON.stringify(error),
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'errr', errors: errors.array() });
        return;
      }

      const data = {
        email: req.body.email,
        username: req.body.username,
        fullname: req.body.fullname,
        password: generateMD5(req.body.password + process.env.SECRET_KEY),
        confirmHash: generateMD5(process.env.SECRET_KEY || Math.random().toString()),
      };

      const user = await UserModel.create(data);

      res.json({
        status: 'success',
        data: user,
      });

      sendEmail(
        {
          emailFrom: 'admin@twitter.com',
          emailTo: data.email,
          subject: 'Подтверждение почты Twitter Clone Tutorial',
          html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:${
            process.env.PORT || 8888
          }/auth/verify?hash=${data.confirmHash}">по этой ссылке</a>`,
        },
        (err: Error | null) => {
          if (err) {
            res.status(500).json({
              status: 'error',
              message: err,
            });
          } else {
            res.status(201).json({
              status: 'success',
              data: user,
            });
          }
        },
      );
    } catch (error) {
      res.json({
        satus: 'error',
        message: JSON.stringify(error),
      });
    }
  }

  async verify(req: express.Request, res: express.Response): Promise<void> {
    try {
      const hash = req.query.hash;

      if (!hash) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findOne({ confirmHash: hash }).exec();

      if (user) {
        user.confirmed = true;
        user.save();
        res.json({
          status: 'success',
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: 'User cant be found',
        });
      }

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.json({
        status: 'error',
        message: JSON.stringify(error),
      });
    }
  }

  async afterLogin(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user ? (req.user as any).toJSON() : undefined;
      res.json({
        status: 'success',
        data: {
          ...user,
          token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || 'qwerty123', {
            expiresIn: '30 days',
          }),
        },
      });
    } catch (error) {
      res.json({
        status: 'error',
        message: JSON.stringify(error),
      });
    }
  }

  async getUserInfo(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user ? (req.user as any).toJSON() : undefined;
      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      res.json({
        status: 'error',
        message: JSON.stringify(error),
      });
    }
  }
}

export const UserCtrl = new UserController();
