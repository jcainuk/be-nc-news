const fs = require("fs/promises");
const path = require("path");

exports.getEndpoints = (req, res, next) => {
  const filePath = path.join(__dirname, "../endpoints.json");
  return fs
    .readFile(filePath)
    .then((data) => {
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    })
    .catch((err) => {
      next(err);
    });
};
