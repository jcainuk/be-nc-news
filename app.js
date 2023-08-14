const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topic.controllers");
const { getEndpoints } = require("./controllers/endpoint.controller");
const { handleCustomErrors } = require("./controllers/error.controllers");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = { app };
