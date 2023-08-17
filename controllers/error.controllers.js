const handleError400s = (err, req, res, next) => {
  if (err.status === 400 || err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Article does not exist" });
  } else {
    next(err);
  }
};

module.exports = { handleCustomErrors, handleError400s };
