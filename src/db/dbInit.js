const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
};

const executeSQLFile = async (connection, filePath) => {
  let sql = fs.readFileSync(filePath, "utf8");

  // Remplacer les placeholders par les valeurs des variables d'environnement
  sql = sql
    .replace("${ADMIN_USER}", process.env.ADMIN_USER)
    .replace("${ADMIN_PASSWORD}", process.env.ADMIN_PASSWORD)
    .replace("${READONLY_USER}", process.env.READONLY_USER)
    .replace("${READONLY_PASSWORD}", process.env.READONLY_PASSWORD)
    .replace("${ORDER_USER}", process.env.ORDER_USER)
    .replace("${ORDER_PASSWORD}", process.env.ORDER_PASSWORD)
    .replace("${MANAGER_USER}", process.env.MANAGER_USER)
    .replace("${MANAGER_PASSWORD}", process.env.MANAGER_PASSWORD);

  await connection.query(sql);
  console.log(`${path.basename(filePath)} exécuté avec succès`);
};

const initDB = async (role, res) => {
  if (role !== "root") {
    return res
      .status(403)
      .json({ error: "Accès Refusé", message: "Seul le root admin est autorisé à initialiser la base de données" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connexion à MySQL réussie");

    // Exécuter les fichiers SQL pour créer les tables et insérer les données
    const dbFilePath = path.join(__dirname, "db.sql");
    const dataFilePath = path.join(__dirname, "data.sql");
    const usersFilePath = path.join(__dirname, "users.sql");

    // Exécuter les fichiers SQL
    await executeSQLFile(connection, dbFilePath);
    await executeSQLFile(connection, dataFilePath);
    await executeSQLFile(connection, usersFilePath);

    console.log("Base de données initialisée avec succès");
    return connection;
  } catch (err) {
    console.error("Impossible d'initialiser la base de données", err);
    return res.status(500).json({
      error: "Échec de l'initialisation de la base de données",
      details: err.message,
    });
  }
};

module.exports = { initDB };
