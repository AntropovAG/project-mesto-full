const jwt = require('jsonwebtoken');
const WrongEmailOrPasswordError = require('../errors/WrongEmailOrPasswordError');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new WrongEmailOrPasswordError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new WrongEmailOrPasswordError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
