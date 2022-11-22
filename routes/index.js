var express = require("express");
var router = express.Router();
const {
  getUsers,
  getUserById,
  getSubsriptionsById,
  getFriendsById,
} = require("../models/users_db");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/users", async function (req, res, next) {
  const users = await getUsers();
  console.log(users);
  res.json(users);
});

router.get("/users/:id/friends", async function (req, res, next) {
  const id = req.params.id;

  const user = await getUserById(id);
  const subscriptions = await getSubsriptionsById(id);
  const friends = await getFriendsById(id);

  res.json({ user, subscriptions, friends });
  // console.log(req.query);
});

module.exports = router;
