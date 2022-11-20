var express = require("express");
var router = express.Router();

const { getUsers } = require("../models/users_db");

router.get("/", async function (req, res, next) {
  const users = await getUsers();
  console.log(users);
  res.json(users);
});

module.exports = router;
