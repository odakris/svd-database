require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
};

const dbConnection = async (role, res) => {
  let user, password;

  switch (role) {
    case "root":
      user = process.env.DB_USER;
      password = process.env.DB_PASSWORD;
      console.log(`Vous êtes connecté en tant que ${role}`);
      break;
    case "admin":
      user = process.env.ADMIN_USER;
      password = process.env.ADMIN_PASSWORD;
      console.log(`Vous êtes connecté en tant que ${role}`);
      break;
    case "readonly":
      user = process.env.READONLY_USER;
      password = process.env.READONLY_PASSWORD;
      console.log(`Vous êtes connecté en tant que ${role}`);
      break;
    case "order":
      user = process.env.ORDER_USER;
      password = process.env.ORDER_PASSWORD;
      console.log(`Vous êtes connecté en tant que ${role}`);
      break;
    case "manager":
      user = process.env.MANAGER_USER;
      password = process.env.MANAGER_PASSWORD;
      console.log(`Vous êtes connecté en tant que ${role}`);
      break;
    default:
      return res
        .status(403)
        .json({ error: "Accès Refusé", message: "Seul le root admin est autorisé à initialiser la base de données" });
  }

  const connection = await mysql.createConnection({ ...dbConfig, user, password, database: process.env.DB_NAME });
  return connection;
};

module.exports = { dbConnection };
