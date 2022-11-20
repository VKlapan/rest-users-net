const fs = require("fs/promises");
const MAX_USERS_LIST_QUANTITY = 500;

const randomUsersQuantity = Math.round(Math.random() * MAX_USERS_LIST_QUANTITY);

async function createUserList() {
  const users = [];
  const relations = [];
  const names = await getNames();

  for (var i = 0; i <= randomUsersQuantity; i += 1) {
    const randomNameIndex = Math.round(Math.random() * names.length);
    const randomSubscriptionQuantity = Math.round(
      Math.random() * randomUsersQuantity
    );
    const subscriptions = [];

    users.push({
      id: i,
      name: names[randomNameIndex],
      gender: randomNameIndex % 2 === 0 ? "male" : "famale",
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

  fs.writeFile("users.json", JSON.stringify(users));
  fs.writeFile("relations.json", JSON.stringify(relations));

  return { users, relations };
}

async function getNames() {
  const nameList = await fs
    .readFile("./names.txt", "utf-8")
    .catch((error) => console.log("ALARM:", error));
  return nameList.split("\n");
}

//createUserList().then(console.log);
