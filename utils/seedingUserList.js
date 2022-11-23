const fs = require("fs/promises");
const { initUsersTable, initRelationsTable } = require("../models/users_db");

const MAX_USERS_LIST_QUANTITY = 500;
const MAX_SUBSRIPTIONS_QUANTITY = 150;

const randomUsersQuantity = Math.round(Math.random() * MAX_USERS_LIST_QUANTITY);

async function createUserList() {
  const users = [];
  const relations = [];
  const names = await getNames();

  for (var i = 0; i <= randomUsersQuantity; i += 1) {
    const randomNameIndex = Math.round(Math.random() * names.length);
    const randomSubscriptionQuantity =
      randomUsersQuantity < MAX_SUBSRIPTIONS_QUANTITY
        ? Math.round(Math.random() * randomUsersQuantity)
        : MAX_SUBSRIPTIONS_QUANTITY;
    const subscriptions = [];

    users.push({
      id: i,
      name: names[randomNameIndex],
      gender: randomNameIndex % 2 === 0 ? "male" : "female",
    });

    for (var j = 0; j <= randomSubscriptionQuantity; j += 1) {
      const randomSubscriptionId = Math.round(
        Math.random() * randomUsersQuantity
      );

      if (randomSubscriptionId !== i) {
        subscriptions.push(randomSubscriptionId);
      }
    }

    const uniqSubscriptions = [...new Set(subscriptions)];

    relations.push({
      id: i,
      subscriptions: uniqSubscriptions,
    });
  }

  //  fs.writeFile("users.json", JSON.stringify(users));
  //  fs.writeFile("relations.json", JSON.stringify(relations));

  await initUsersTable(users);
  await initRelationsTable(relations);

  return { users, relations };
}

async function getNames() {
  const nameList = await fs
    .readFile("./names.txt", "utf-8")
    .catch((error) => console.log("ALARM:", error));
  return nameList.split("\n");
}

createUserList().then(console.log);
