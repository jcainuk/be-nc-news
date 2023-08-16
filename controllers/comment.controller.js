const { insertComment } = require("../models/comment.models");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;

  const { username, body } = req.body;

  if (typeof username !== "string" || typeof body !== "string") {
    return res.status(400).send({ msg: "Bad request" });
  }

  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      console.log(err.code);
      next(err);
    });
};
