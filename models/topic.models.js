const db = require("../db/connection");

exports.selectAllTopics = (treasure_id) => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};
