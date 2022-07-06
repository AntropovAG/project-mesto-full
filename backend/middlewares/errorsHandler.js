module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  return next();
};
