const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  multipleStatements: true,
};

const executeSQLFile = async (connection, filePath) => {
  const sql = fs.readFileSync(filePath, "utf8");
  await connection.query(sql);
  console.log(`${path.basename(filePath)} exécuté avec succès`);
};

const initDB = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connexion à MySQL réussie");

    // await executeSQLFile(connection, "./src/db/db.sql");
    // await connection.changeUser({ database: "avion_papier" });
    // await executeSQLFile(connection, "./src/db/data.sql");

    // Exécuter les fichiers SQL pour créer les tables et insérer les données
    const dbFilePath = path.join(__dirname, "db.sql");
    const dataFilePath = path.join(__dirname, "data.sql");
    await executeSQLFile(connection, dbFilePath);
    await executeSQLFile(connection, dataFilePath);

    console.log("Base de données initialisée avec succès");
    return connection;
  } catch (err) {
    console.error("Impossible d'initialiser la base de données", err);
    process.exit(1);
  }
};

module.exports = { initDB };
