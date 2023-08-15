const handleError400s = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
};

module.exports = { handleCustomErrors, handleError400s };
