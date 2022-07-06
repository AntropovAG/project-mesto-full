const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  WRONG_EMAIL_OR_PASSWORD,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;
const DuplicateEmailError = require('../errors/DuplicateEmailError');
const NotFoundError = require('../errors/NotFoundError');
const WrongDataError = require('../errors/WrongDataError');
const WrongEmailOrPasswordError = require('../errors/WrongEmailOrPasswordError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

module.exports.getUserByID = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Такой пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new WrongDataError('Ошибка в ID пользователя'));
      }
      return next(error);
    });
};

module.exports.createNewUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
    }))
    .catch((error) => {
      if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
        return next(new DuplicateEmailError('Пользователь с таким email уже существует'));
      }
      if (error.name === 'ValidationError') {
        return next(new WrongDataError('Введены неверные данные'));
      }
      return next(error);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Такой пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new WrongDataError('Введены неверные данные'));
      }
      if (error.name === 'CastError') {
        return next(new WrongDataError('Ошибка в ID пользователя'));
      }
      return next(error);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Такой пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new WrongDataError('Введены неверные данные'));
      }
      if (error.name === 'CastError') {
        return next(new WrongDataError('Ошибка в ID пользователя'));
      }
      return next(error);
    });
};

module.exports.userLogin = (req, res, next) => {
  const { email, password } = req.body;
  let user;

  User.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        return next(new WrongEmailOrPasswordError('Неправильный e-mail или пароль'));
      }
      user = foundUser;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return next(new WrongEmailOrPasswordError('Неправильный e-mail или пароль'));
      }
      const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.send({ token });
    })
    .catch((error) => {
      if (error.statusCode === WRONG_EMAIL_OR_PASSWORD) {
        return next(new WrongEmailOrPasswordError('Неправильный e-mail или пароль'));
      }
      return next(error);
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        return next(new NotFoundError('Такой пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new WrongDataError('Ошибка в ID пользователя'));
      }
      return next(error);
    });
};
