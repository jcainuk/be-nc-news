const db = require("../db/connection");

exports.insertComment = (article_id, username, body) => {
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Bad request"
    });
  }

  return db
    .query(
      `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return { status: "not_found", msg: "Comment does not exist" };
      }

      return { status: "deleted", msg: "Comment deleted successfully" };
    });
};

exports.getCommentCount = (articleId) => {
  // Perform a database query to count comments for the given articleId
  const query = `
    SELECT COUNT(comment_id) AS comment_count
    FROM comments
    WHERE article_id = $1
  `;
  const values = [articleId];

  return db.query(query, values).then((result) => {
    const commentCount = parseInt(result.rows[0].comment_count, 10);
    return commentCount;
  });
};
