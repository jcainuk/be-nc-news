const handleSqlErrors = (error, request, response, next) => {
  if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ msg: "Bad request" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "Input value not found" });
  } else if (error.code === "23505") {
    response.status(400).send({ msg: "Slug already exists" });
  } else {
    next(error);
  }
};

const handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};

const handle500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { handleSqlErrors, handleCustomErrors, handle500Errors };
