import validator from 'express-validator';

export const registerValidations = [
  validator
    .body('email')
    .isEmail()
    .withMessage('Неверный емейл')
    .isLength({
      min: 10,
      max: 40,
    })
    .withMessage('Неверная длина почты'),
  validator
    .body('fullname', 'Введите ваше имя')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('Допустимое количество символов от 2 до 40'),
  validator
    .body('username', 'Введите ваш логин')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('Допустимое количество символов от 2 до 40'),
  validator
    .body('password', 'Введите ваш пароль')
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
