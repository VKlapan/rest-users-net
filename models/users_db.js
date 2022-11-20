var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:klapan2022klapan@localhost:5432/users-db");
const fs = require("fs/promises");

async function getUsers() {
  const users = await db.any("SELECT * FROM users").catch(function (error) {
    console.log("ERROR:", error);
  });
  return users;
}

async function addUser(user) {
  await db.none(
    "INSERT INTO users(name, gender) VALUES(${name}, ${gender})",
    user
  );
}

async function addRelation(relation) {
  await db.none(
    "INSERT INTO relations(id, subscriptions) VALUES(${id}, ${subscriptions})",
    relation
  );
}

async function initUsersTable() {
  const response = await fs.readFile("../utils/users.json", "utf-8");
  const users = JSON.parse(response);
  users.map((user) => addUser(user));
}

async function initRelationsTable() {
  const response = await fs.readFile("../utils/relations.json", "utf-8");
  const relations = JSON.parse(response);
  relations.map((relation) => addRelation(relation));
}

//initUsersTable();
//initRelationsTable();

module.exports = { getUsers, addUser };

// CREATE TABLE public.relations (
// 	id integer NOT NULL,
// 	subscriptions integer[] NULL
// );
