const db = require("../db/connection");
const { selectArticleById } = require("./article.models");

exports.insertComment = (article_id, username, body) => {
  return selectArticleById(article_id).then((articleExists) => {
    if (!articleExists) {
      res.status(404).send({ msg: "Article does not exist" });
    }

    return db
      .query(
        `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
        [body, article_id, username]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
