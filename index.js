const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "avion_papier",
};

// Connection à la base de données
const dbConnection = async () => {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
};

// CATEGORIES CRUD //////////////////////////////////////////////////////////////////////////////
// GET
app.get("/categories", async (req, res) => {
  const connection = await dbConnection();
  const [categories] = await connection.query("SELECT * FROM Categories");
  res.json(categories);
});

// POST
app.post("/categories", async (req, res) => {
  const connection = await dbConnection();
  const { nom } = req.body;
  await connection.query(`INSERT INTO Categories (nom) VALUES ('${nom}')`);
  res.send("Categorie ajoutée");
});

// PUT
app.put("/categories/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom } = req.body;
  await connection.query(`UPDATE Categories SET nom = '${nom}' WHERE id = '${id}'`);
  res.send("Categorie mise à jour");
});

// DELETE
app.delete("/categories/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  await connection.query(`DELETE FROM Categories WHERE id = '${id}'`);
  res.send("Categorie mise à jour");
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
