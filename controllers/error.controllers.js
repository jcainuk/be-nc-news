const handleError400s = (err, req, res, next) => {
  if (err.status === 400 || err.code === "22P02" || err.code === "23502") {
    return res.status(400).send({ msg: "Bad request" });
  }
  next(err);
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.msg && err.status) {
    return res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "23503") {
    return res.status(404).send({ msg: "Article does not exist" });
  }
  next(err);
};

module.exports = { handleCustomErrors, handleError400s };
