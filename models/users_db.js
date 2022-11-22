var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:klapan2022klapan@localhost:5432/users-db");
const fs = require("fs/promises");

async function getUsers() {
  const users = await db.any("SELECT * FROM users").catch(function (error) {
    console.log("ERROR:", error);
  });
  return users;
}

async function getUserById(id) {
  const user = await db
    .any(`SELECT * FROM users WHERE id = ${id}`)
    .catch(function (error) {
      console.log("ERROR:", error);
    });
  return user;
}

async function getSubsriptionsById(id) {
  const subscriptions = await db
    .any(`SELECT subscriptions FROM relations WHERE id = ${id}`)
    .catch(function (error) {
      console.log("ERROR:", error);
    });
  return subscriptions;
}

async function getFriendsById(id) {
  const friends = await db
    .any(`select * from get_subscriptions(${id}) order by name`)
    .catch(function (error) {
      console.log("ERROR:", error);
    });
  return friends;
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

module.exports = {
  getUsers,
  addUser,
  getUserById,
  getSubsriptionsById,
  getFriendsById,
};

// CREATE TABLE public.relations (
// 	id integer NOT NULL,
// 	subscriptions integer[] NULL
// );

/*  

/max-following - endpoint для отримання топ-5 юзерів, які зробили найбільше підписок.

select id, subscriptions from relations order by array_length(subscriptions, 1) desc limit 5

 ----------------------

/not-following - endpoint для отримання юзерів, якi зробили 0 підписок

select id, subscriptions from relations where array_length(subscriptions, 1) = 0

 ----------------------

 /users/123/friends?order_by=id&order_type=desc

CREATE FUNCTION is_friend(user_id int, friend_id int) RETURNS bool AS $$
DECLARE
  friend bool = false;
DECLARE
  x int;

BEGIN
  FOREACH x IN ARRAY array [(select subscriptions from relations where id = $2)]
  LOOP
if x = $1 then friend = true;
end if;
  END LOOP;
 
 return friend;
END;
$$ LANGUAGE plpgsql;

select is_friend(6, 46)

CREATE FUNCTION get_subscriptions(int) RETURNS setof users AS $$
DECLARE
  x int;

begin
  FOREACH x IN ARRAY array [(select subscriptions from relations where id = $1)]
  loop
	return query (select *  from users where id = x and true = is_friend($1, x));
  END LOOP;
END;
$$ LANGUAGE plpgsql;

select * from get_subscriptions(61) order by name
*/
