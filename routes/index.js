var express = require("express");
var router = express.Router();
const {
  getUsers,
  getUserById,
  getSubsriptionsById,
  getFriendsById,
  getTop5MaxFollowingUsers,
  getNullFollowingUsers,
} = require("../models/users_db");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* endpoints */

router.get("/users", async function (req, res, next) {
  const users = await getUsers();
  res.json(users);
});

router.get("/users/:id/friends", async function (req, res, next) {
  const id = req.params.id;
  const order_by = req.query.order_by;
  const order_type = req.query.order_type;

  const user = await getUserById(id);
  const subscriptions = await getSubsriptionsById(id);
  const friends = await getFriendsById(id, order_by, order_type);

  res.json({ user, subscriptions, friends });
});

router.get("/max-following", async function (req, res, next) {
  const users = await getTop5MaxFollowingUsers();
  res.json(users);
});

router.get("/not-following", async function (req, res, next) {
  const users = await getNullFollowingUsers();
  res.json(users);
});

module.exports = router;
