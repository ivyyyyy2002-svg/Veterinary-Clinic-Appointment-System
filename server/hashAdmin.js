const bcrypt = require("bcrypt");

async function run() {
  const plain = "123";      //admin password
  const rounds = 12;

  const hash = await bcrypt.hash(plain, rounds);
  console.log("Plain password:", plain);
  console.log("Bcrypt hash:", hash);
}

run();
