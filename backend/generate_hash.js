const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log("Usage: node generate_hash.js <your_new_password>");
  process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log("\n--- YOUR SECURE HASH ---");
console.log(hash);
console.log("------------------------\n");
console.log("Copy the hash above and paste it into the 'passwordHash' field in your JSON file.");
