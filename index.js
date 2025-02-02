const express = require("express");
const mysql = require("mysql2/promise");
const { initDB } = require("./dbInit");

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

// Initialisation de la base de données
app.post("/init", async (req, res) => {
  await initDB();
  res.send("Base de données initialisée avec succès !");
});

// CATEGORIES CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/categories", async (req, res) => {
  const connection = await dbConnection();
  const [categories] = await connection.query("SELECT * FROM categories");
  res.json(categories);
});

// GET ONE
app.get("/categories/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const [categories] = await connection.query(`SELECT * FROM categories WHERE id = ${id}`);
  res.json(categories[0]);
});

// POST
app.post("/categories", async (req, res) => {
  const connection = await dbConnection();
  const { nom } = req.body;
  await connection.query(`INSERT INTO categories (nom) VALUES ('${nom}')`);
  res.send("Categorie ajoutée");
});

// PUT
app.put("/categories/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom } = req.body;
  await connection.query(`UPDATE categories SET nom = '${nom}' WHERE id = '${id}'`);
  res.send("Categorie mise à jour");
});

// DELETE
app.delete("/categories/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  await connection.query(`DELETE FROM categories WHERE id = '${id}'`);
  res.send("Categorie supprimée");
});

// PRODUITS CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/produits", async (req, res) => {
  const connection = await dbConnection();
  const [produits] = await connection.query("SELECT * FROM produits");
  res.json(produits);
});

// GET ONE
app.get("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const [produits] = await connection.query(`SELECT * FROM produits WHERE id = ${id}`);
  res.json(produits[0]);
});

// POST
app.post("/produits", async (req, res) => {
  const connection = await dbConnection();
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;
  await connection.query(
    `INSERT INTO produits (reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur) VALUES ('${reference}','${nom}','${description_produit}','${prix_unitaire}','${quantite_stock}','${id_categorie}','${id_fournisseur}')`
  );
  res.send("Produit ajouté");
});

// PUT
app.put("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;
  await connection.query(
    `UPDATE produits SET reference = '${reference}', nom = '${nom}', description_produit = '${description_produit}', prix_unitaire = '${prix_unitaire}', quantite_stock = '${quantite_stock}', id_categorie = '${id_categorie}', id_fournisseur = '${id_fournisseur}' WHERE id = '${id}'`
  );
  res.send("Produit mis à jour");
});

// DELETE
app.delete("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  await connection.query(`DELETE FROM produits WHERE id = '${id}'`);
  res.send("Produit supprimé");
});

// FOURNISSEURS CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/fournisseurs", async (req, res) => {
  const connection = await dbConnection();
  const [fournisseurs] = await connection.query("SELECT * FROM fournisseurs");
  res.json(fournisseurs);
});

// GET ONE
app.get("/fournisseurs/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const [fournisseurs] = await connection.query(`SELECT * FROM fournisseurs WHERE id = ${id}`);
  res.json(fournisseurs[0]);
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
  await connection.query(`DELETE FROM fournisseurs WHERE id = '${id}'`);
  res.send("Fournisseur supprimé");
});

// CLIENTS CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/clients", async (req, res) => {
  const connection = await dbConnection();
  const [clients] = await connection.query("SELECT * FROM clients");
  res.json(clients);
});

// GET ONE
app.get("/clients/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const [clients] = await connection.query(`SELECT * FROM clients WHERE id = ${id}`);
  res.json(clients[0]);
});

// POST
app.post("/clients", async (req, res) => {
  const connection = await dbConnection();
  const { nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;
  await connection.query(
    `INSERT INTO clients (nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email) VALUES ('${nom}', '${prenom}', '${numero_adresse}', '${rue_adresse}', '${code_postal}', '${ville}', '${telephone}', '${email}')`
  );
  res.send("Client ajouté");
});

// PUT
app.put("/clients/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;
  await connection.query(
    `UPDATE clients SET nom = '${nom}', prenom = '${prenom}', numero_adresse = '${numero_adresse}', rue_adresse = '${rue_adresse}', code_postal = '${code_postal}', ville = '${ville}', telephone = '${telephone}', email = '${email}' WHERE id = '${id}'`
  );
  res.send("Client mis à jour");
});

// DELETE
app.delete("/clients/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  await connection.query(`DELETE FROM clients WHERE id = '${id}'`);
  res.send("Client supprimé");
});

// COMMANDE CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/commandes", async (req, res) => {
  const connection = await dbConnection();

  const [commandes] = await connection.query("SELECT * FROM commandes");
  const result = [];

  for (const commande of commandes) {
    const [lignes_commandes] = await connection.query(
      `SELECT * FROM lignes_commandes WHERE id_commande = ${commande.id}`
    );
    result.push({ commande, lignes_commandes });
  }

  res.json(result);
});

// GET ONE
app.get("/commandes/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  const [commandes] = await connection.query(`SELECT * FROM commandes WHERE id = ${id}`);
  const [lignes_commandes] = await connection.query(`SELECT * FROM lignes_commandes WHERE id_commande = ${id}`);

  res.json({ commande: commandes[0], lignes_commandes });
});

// POST
app.post("/commandes", async (req, res) => {
  const connection = await dbConnection();
  const { date_commande, prix_total, id_client, lignes_commandes } = req.body;

  const [commande] = await connection.query(
    `INSERT INTO commandes (date_commande, prix_total, id_client) VALUES ('${date_commande}', ${prix_total}, ${id_client})`
  );

  const id_commande = commande.insertId;

  for (const ligne of lignes_commandes) {
    await connection.query(
      `INSERT INTO lignes_commandes (id_commande, id_produit, quantite, prix_unitaire, total_ligne) VALUES (${id_commande}, ${ligne.id_produit}, ${ligne.quantite}, ${ligne.prix_unitaire}, ${ligne.quantite} * ${ligne.prix_unitaire})`
    );
  }
  res.send("Commande ajoutée");
});

// PUT
app.put("/commandes/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { date_commande, prix_total, id_client, lignes_commandes } = req.body;

  await connection.query(
    `UPDATE commandes SET date_commande = '${date_commande}', prix_total = ${prix_total}, id_client = ${id_client} WHERE id = ${id}`
  );
  await connection.query(`DELETE FROM lignes_commandes WHERE id_commande = ${id}`);

  for (const ligne of lignes_commandes) {
    await connection.query(
      `INSERT INTO lignes_commandes (id_commande, id_produit, quantite, prix_unitaire, total_ligne) VALUES (${id}, ${ligne.id_produit}, ${ligne.quantite}, ${ligne.prix_unitaire}, ${ligne.quantite} * ${ligne.prix_unitaire})`
    );
  }

  res.send("Commande mise à jour avec ses lignes !");
});

// DELETE
app.delete("/commandes/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  await connection.query(`DELETE FROM lignes_commandes WHERE id_commande = ${id}`);
  await connection.query(`DELETE FROM commandes WHERE id = ${id}`);
  res.send("Commande et ses lignes supprimées !");
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
