const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist"
        });
      }
      return rows[0];
    });
};

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  const tableHeaders = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url"
  ];

  if (
    !tableHeaders.includes(sort_by) ||
    (order !== "desc" && order !== "asc")
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryValues = [];
  let baseSqlStringOne = `
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::integer AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    baseSqlStringOne += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  baseSqlStringOne += `
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order}
  `;

  return db.query(baseSqlStringOne, queryValues).then((result) => {
    return result.rows;
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist"
        });
      }
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist"
        });
      }
      return result.rows;
    });
};
