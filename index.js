const express = require("express");
const mysql = require("mysql2/promise");
// const fs = require("fs");

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
  res.send("Categorie supprimée");
});

// PRODUITS CRUD //////////////////////////////////////////////////////////////////////////////
// GET
app.get("/produits", async (req, res) => {
  const connection = await dbConnection();
  const [produits] = await connection.query("SELECT * FROM produits");
  res.json(produits);
});

// POST
app.post("/produits", async (req, res) => {
  const connection = await dbConnection();
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;
  await connection.query(
    `INSERT INTO Produits (reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur) VALUES ('${reference}','${nom}','${description_produit}','${prix_unitaire}','${quantite_stock}','${id_categorie}','${id_fournisseur}')`
  );
  res.send("Produit ajouté");
});

// PUT
app.put("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;
  await connection.query(
    `UPDATE Produits SET reference = '${reference}', nom = '${nom}', description_produit = '${description_produit}', prix_unitaire = '${prix_unitaire}', quantite_stock = '${quantite_stock}', id_categorie = '${id_categorie}', id_fournisseur = '${id_fournisseur}' WHERE id = '${id}'`
  );
  res.send("Produit mis à jour");
});

// DELETE
app.delete("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  await connection.query(`DELETE FROM Produits WHERE id = '${id}'`);
  res.send("Produit supprimé");
});

// FOURNISSEURS CRUD //////////////////////////////////////////////////////////////////////////////
// GET
app.get("/fournisseurs", async (req, res) => {
  const connection = await dbConnection();
  const [fournisseurs] = await connection.query("SELECT * FROM fournisseurs");
  res.json(fournisseurs);
});

// POST
app.post("/fournisseurs", async (req, res) => {
  const connection = await dbConnection();
  const { nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;
  await connection.query(
    `INSERT INTO fournisseurs (nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email) VALUES ('${nom}','${numero_adresse}','${rue_adresse}','${code_postal}','${ville}','${telephone}','${email}')`
  );
  res.send("Fournisseur ajouté");
});

// PUT
app.put("/fournisseurs/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;
  await connection.query(
    `UPDATE fournisseurs SET nom = '${nom}', numero_adresse = '${numero_adresse}', rue_adresse = '${rue_adresse}', code_postal = '${code_postal}', ville = '${ville}', telephone = '${telephone}', email = '${email}' WHERE id = '${id}'`
  );
  res.send("Fournisseurs mis à jour");
});

// DELETE
app.delete("/fournisseurs/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  await connection.query(`DELETE FROM Fournisseurs WHERE id = '${id}'`);
  res.send("fournisseur supprimé");
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
