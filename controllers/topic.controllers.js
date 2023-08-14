const { selectAllTopics } = require("../models/topic.models");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch((err) => {
      next(err);
    });
};
