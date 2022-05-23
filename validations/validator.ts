import { body } from 'express-validator';

export const registerValidations = [
  body('email', 'Введите E-Mail')
    .isEmail()
    .withMessage('Неверный емейл')
    .isLength({
      min: 10,
      max: 40,
    })
    .withMessage('Неверная длина почты'),

  body('fullname', 'Введите ваше имя')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('Допустимое количество символов от 2 до 40'),

  body('username', 'Введите ваш логин')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('Допустимое количество символов от 2 до 40'),

  body('password', 'Введите ваш пароль')
    .isLength({
      min: 6,
    })
    .withMessage('Минимальное количество символов от 6')
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error('Пароли не совпадают');
      } else {
        return value;
      }
    }),
];
