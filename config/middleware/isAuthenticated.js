module.exports = function(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).send({ error: 'Unauthorized' });
};
