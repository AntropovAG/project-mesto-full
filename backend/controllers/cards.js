const Card = require('../models/card');
const NoRightsToDeleteError = require('../errors/NoRightsToDeleteError');
const NotFoundError = require('../errors/NotFoundError');
const WrongDataError = require('../errors/WrongDataError');

module.exports.createNewCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new WrongDataError('Введены неверные данные'));
      }
      return next(error);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Такой карточки не обнаружено'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new NoRightsToDeleteError('Удаление чужой карточки запрещено'));
      }
      return res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new WrongDataError('Ошибка в ID карточки'));
      }
      return next(error);
    });
};

module.exports.setCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Такой карточки не обнаружено'));
      }
      return res.status(200).send({ card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new WrongDataError('Ошибка в ID карточки'));
      }
      return next(error);
    });
};

module.exports.removeCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError('Такой карточки не обнаружено'));
    })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Такой карточки не обнаружено'));
      }
      return res.status(200).send({ card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new WrongDataError('Ошибка в ID карточки'));
      }
      return next(error);
    });
};
