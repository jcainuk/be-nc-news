const { selectAllUsers } = require("../models/user.models");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};
