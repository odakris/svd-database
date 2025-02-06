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

  try {
    // Récupérer toutes les catégories
    const [result] = await connection.execute("SELECT * FROM categories");

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories: ", error);
    res.status(500).json({ error: "Échec lors de la récupération des catégories", details: error.message });
  } finally {
    connection.end();
  }
});

// GET ONE
app.get("/categories/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Récupérer la catégorie
    const [result] = await connection.execute("SELECT * FROM categories WHERE id = ?", [id]);

    // Vérifier si la catégorie existe
    if (!result.length) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie: ", error);
    res.status(500).json({ error: "Échec lors de la récupération de la catégorie", details: error.message });
  } finally {
    connection.end();
  }
});

// POST
app.post("/categories", async (req, res) => {
  const connection = await dbConnection();
  const { nom } = req.body;

  try {
    // Vérifier si le champ 'nom' est renseigné
    if (!nom) {
      return res.status(400).json({ error: "le champ 'nom' est requis" });
    }

    await connection.beginTransaction();

    // Ajouter la catégorie
    const [row] = await connection.execute("INSERT INTO categories (nom) VALUES (?)", [nom]);

    // Récupérer la catégorie ajoutée
    const [result] = await connection.execute("SELECT * FROM categories WHERE id = ?", [row.insertId]);

    await connection.commit();

    res.status(201).json({ message: "Catégorie ajoutée", result });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de l'ajout de la catégorie: ", error);
    res.status(500).json({ error: "Échec de l'ajout de la catégorie", details: error.message });
  } finally {
    connection.end();
  }
});

// PUT
app.put("/categories/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom } = req.body;

  try {
    // Vérifier si le champ 'nom' est renseigné
    if (!nom) {
      return res.status(400).json({ error: "le champ 'nom' est requis" });
    }

    // Verifier si la catégorie existe
    const [category] = await connection.execute("SELECT * FROM categories WHERE id = ?", [id]);
    if (!category.length) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    await connection.beginTransaction();

    // Mettre à jour la catégorie
    await connection.execute("UPDATE categories SET nom = ? WHERE id = ?", [nom, id]);

    // Récupérer la catégorie mise à jour
    const [result] = await connection.execute("SELECT * FROM categories WHERE id = ?", [id]);

    await connection.commit();

    res.status(200).json({ message: "Catégorie mise à jour", result });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la mise à jour de la catégorie: ", error);
    res.status(500).json({ error: "Échec de la mise à jour de la catégorie", details: error.message });
  } finally {
    connection.end();
  }
});

// DELETE
app.delete("/categories/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Verifier si la catégorie existe
    const [category] = await connection.execute("SELECT * FROM categories WHERE id = ?", [id]);

    if (!category.length) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    await connection.beginTransaction();

    // Supprimer la catégorie
    await connection.execute("DELETE FROM categories WHERE id = ?", [id]);

    await connection.commit();
    res.status(200).send("Catégorie supprimée");
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la suppression de la catégorie: ", error);
    res.status(500).json({ error: "Échec de la suppression de la catégorie", details: error.message });
  } finally {
    connection.end();
  }
});

// PRODUITS CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/produits", async (req, res) => {
  const connection = await dbConnection();

  try {
    // Récupérer tous les produits
    const [result] = await connection.execute("SELECT * FROM produits");

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits: ", error);
    res.status(500).json({ error: "Échec lors de la récupération des produits", details: error.message });
  } finally {
    connection.end();
  }
});

// GET ONE
app.get("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Récupérer le produit
    const [result] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id]);

    if (!result.length) {
      res.status(404).json({ error: "Produit non trouvé" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit: ", error);
    res.status(500).json({ error: "Échec lors de la récupération du produit", details: error.message });
  } finally {
    connection.end();
  }
});

// POST
app.post("/produits", async (req, res) => {
  const connection = await dbConnection();
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés
    if (
      !reference ||
      !nom ||
      !description_produit ||
      !prix_unitaire ||
      !quantite_stock ||
      !id_categorie ||
      !id_fournisseur
    ) {
      return res.status(400).json({
        error:
          "Les champs 'reference', 'nom', 'description_produit','prix_unitaire', 'quantite_stock', 'id_categorie' et 'id_fournisseur' sont requis",
      });
    }

    await connection.beginTransaction();

    // Ajouter le produit
    const [row] = await connection.execute(
      "INSERT INTO produits (reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur]
    );

    // Récupérer le produit ajouté
    const [result] = await connection.execute("SELECT * FROM produits WHERE id = ?", [row.insertId]);

    await connection.commit();

    res.status(201).json({ message: "Produit ajouté", result });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de l'ajout du produit: ", error);
    res.status(500).json({ error: "Échec lors de l'ajout du produit", details: error.message });
  } finally {
    connection.end();
  }
});

// PUT
app.put("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés
    if (
      !reference ||
      !nom ||
      !description_produit ||
      !prix_unitaire ||
      !quantite_stock ||
      !id_categorie ||
      !id_fournisseur
    ) {
      return res.status(400).json({
        error:
          "Les champs 'reference', 'nom', 'description_produit','prix_unitaire', 'quantite_stock', 'id_categorie' et 'id_fournisseur' sont requis",
      });
    }

    // Vérifier si le produit existe
    const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id]);

    if (!produit.length) {
      res.status(400).json({ error: "Produit non trouvé" });
    }

    await connection.beginTransaction();

    // Mettre à jour le produit
    await connection.execute(
      "UPDATE produits SET reference = ?, nom = ?, description_produit = ?, prix_unitaire = ?, quantite_stock = ?, id_categorie = ?, id_fournisseur = ? WHERE id = ?",
      [reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur, id]
    );

    // Récupérer le produit mis à jour
    const [result] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id]);

    await connection.commit();

    res.status(200).json({ message: "Produit mis à jour", result });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la mise à jour du produit: ", error);
    res.status(500).json({ error: "Échec lors de la mise à jour du produit", details: error.message });
  } finally {
    connection.end();
  }
});

// DELETE
app.delete("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Vérifier si le produit existe
    const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id]);

    if (!produit.length) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    await connection.beginTransaction();

    // Supprimer le produit
    await connection.execute("DELETE FROM produits WHERE id = ?", [id]);

    await connection.commit();

    res.status(200).json({ message: "Produit supprimé" });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la suppression du produit: ", error);
    res.status(500).json({ error: "Échec lors de la suppression du produit", details: error.message });
  } finally {
    connection.end();
  }
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
      `INSERT INTO lignes_commandes (id_commande, id_produit, quantite, prix_unitaire, total_ligne) VALUES (${id_commande}, ${ligne.id_produit}, ${ligne.quantite}, ${ligne.prix_unitaire}, ${ligne.total_ligne})`
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
      `INSERT INTO lignes_commandes (id_commande, id_produit, quantite, prix_unitaire, total_ligne) VALUES (${id}, ${ligne.id_produit}, ${ligne.quantite}, ${ligne.prix_unitaire}, ${ligne.total_ligne})`
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
