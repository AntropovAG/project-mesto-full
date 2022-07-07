const jwt = require('jsonwebtoken');
const WrongEmailOrPasswordError = require('../errors/WrongEmailOrPasswordError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new WrongEmailOrPasswordError('Необходима авторизация - нет токена'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new WrongEmailOrPasswordError('Необходима авторизация - токен не прошёл проверку'));
  }

  req.user = payload;

  return next();
};
