var pgp = require("pg-promise")(/*options*/);
// var db = pgp("postgres://postgres:klapan2022klapan@localhost:5432/users-db");

const db_credentials = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
var db = pgp(db_credentials);

const fs = require("fs/promises");

/* functions for endpoints */

async function getUsers() {
  const users = await db
    .any(
      "select u.id, u.name, u.gender, ARRAY(select * from get_subscription_name(u.id)) as subscriptions from users u"
    )
    .catch(function (error) {
      console.log("ERROR:", error);
    });
  return users;
}

async function getFriendsById(id, order_by = "name", order_type = "") {
  const friends = await db
    .any(
      `select * from get_subscriptions(${id}) order by ${order_by} ${order_type}`
    )
    .catch(function (error) {
      console.log("ERROR:", error);
    });
  return friends;
}

async function getTop5MaxFollowingUsers() {
  const users = await db
    .any(
      "select u.name, array_length(r.subscriptions, 1) as subscriptions_counts from relations r, users u where u.id = r.id order by array_length(subscriptions, 1) desc limit 5"
    )
    .catch(function (error) {
      console.log("ERROR:", error);
    });
  return users;
}

async function getNullFollowingUsers() {
  const users = await db
    .any(
      "select u.name, array_length(r.subscriptions, 1) from relations r, users u where u.id = r.id and array_length(subscriptions, 1) = 2"
    )
    .catch(function (error) {
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

/* initialization functions */

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

async function initUsersTable(users) {
  //  const response = await fs.readFile("../utils/users.json", "utf-8");
  //  const users = JSON.parse(response);
  users.map((user) => addUser(user));
}

async function initRelationsTable(relations) {
  //  const response = await fs.readFile("../utils/relations.json", "utf-8");
  //  const relations = JSON.parse(response);
  relations.map((relation) => addRelation(relation));
}

module.exports = {
  initUsersTable,
  initRelationsTable,
  getUsers,
  addUser,
  getUserById,
  getSubsriptionsById,
  getFriendsById,
  getTop5MaxFollowingUsers,
  getNullFollowingUsers,
};

// CREATE TABLE public.relations (
// 	id integer NOT NULL,
// 	subscriptions integer[] NULL
// );

/*  

/users  - endpoint для отримання усіх юзерів (з підписками).

CREATE FUNCTION get_friends(int) RETURNS table (user_name varchar) AS $$
DECLARE
  x int;

BEGIN
  FOREACH x IN ARRAY array [(select subscriptions from relations where id = $1)]
  loop
	  return query (select name from users where id = x);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

select u.id, u.name, ARRAY(select * from get_friends(u.id)) from users u

/max-following - endpoint для отримання топ-5 юзерів, які зробили найбільше підписок.

select u.name, array_length(r.subscriptions, 1) from relations r, users u where u.id = r.id order by array_length(subscriptions, 1) desc limit 5

 ----------------------

/not-following - endpoint для отримання юзерів, якi зробили 0 підписок

select u.name, array_length(r.subscriptions, 1) from relations r, users u where u.id = r.id and array_length(subscriptions, 1) = 2

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
