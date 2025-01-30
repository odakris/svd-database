const express = require("express");
const mysql = require("mysql2/promise");
const fs = require("fs");

const app = express();
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  multipleStatements: true,
};

const executeSQLFile = async (connection, filePath) => {
  const sql = fs.readFileSync(filePath, "utf8");
  await connection.query(sql);
  console.log(`${filePath} exécuté avec succès`);
};

const initDB = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Connexion à MySQL réussie");

    await executeSQLFile(connection, "db.sql");

    await connection.changeUser({ database: "avion_papier" });

    await executeSQLFile(connection, "data.sql");

    console.log("Base de données initialisée avec succès");
    return connection;
  } catch (err) {
    console.error("Erreur lors de l'initialisation de la base de données :", err);
    process.exit(1);
  }
};

initDB().then((connection) => {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});
