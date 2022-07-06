const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getUsers,
  getUserByID,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUserInfo);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserByID);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)/),
  }),
}), updateUserAvatar);

module.exports = router;
