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
const { postComment } = require("./controllers/comment.controller");

const {
  handleCustomErrors,
  handleError400s
} = require("./controllers/error.controllers");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

app.use(handleError400s);
app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = { app };
