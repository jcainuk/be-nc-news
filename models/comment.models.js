const db = require("../db/connection");
const { selectArticleById } = require("./article.models"); // Import the articleExists function

exports.insertComment = (article_id, username, body) => {
  return selectArticleById(article_id) // Check if article exists first
    .then((articleExists) => {
      if (!articleExists) {
        res.status(404).send({ msg: "Article does not exist" }); // Throw an error to be caught later
      }

      // Article exists, proceed with comment insertion
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
