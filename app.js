const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topic.controllers");
const { getEndpoints } = require("./controllers/endpoint.controller");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  patchArticle
} = require("./controllers/article.controller");
const {
  postComment,
  deleteComment
} = require("./controllers/comment.controller");
const { getAllUsers } = require("./controllers/user.controller");

const {
  handleSqlErrors,
  handleCustomErrors,
  handle500Errors
} = require("./controllers/error.controllers");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/users", getAllUsers);

app.use(handleSqlErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = { app };
