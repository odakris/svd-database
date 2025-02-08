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
  timezone: "Z", // Forces Node.js to use UTC!
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
    await connection.end();
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
    await connection.end();
  }
});

// POST
app.post("/categories", async (req, res) => {
  const connection = await dbConnection();
  const { nom } = req.body;

  try {
    // Vérifier si le champ 'nom' est renseigné
    if (!nom) {
      return res.status(404).json({ error: "le champ 'nom' est requis" });
    }

    await connection.beginTransaction();

    // Ajouter la catégorie
    const [row] = await connection.execute("INSERT INTO categories (nom) VALUES (?)", [nom]);

    // Récupérer la catégorie ajoutée
    const [result] = await connection.execute("SELECT * FROM categories WHERE id = ?", [row.insertId]);

    await connection.commit();

    res.status(201).json({ message: "Catégorie ajoutée", result: result[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de l'ajout de la catégorie: ", error);
    res.status(500).json({ error: "Échec de l'ajout de la catégorie", details: error.message });
  } finally {
    await connection.end();
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
      return res.status(404).json({ error: "le champ 'nom' est requis" });
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

    res.status(200).json({ message: "Catégorie mise à jour", result: result[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la mise à jour de la catégorie: ", error);
    res.status(500).json({ error: "Échec de la mise à jour de la catégorie", details: error.message });
  } finally {
    await connection.end();
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
    await connection.end();
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
    await connection.end();
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
    await connection.end();
  }
});

// POST
app.post("/produits", async (req, res) => {
  const connection = await dbConnection();
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = [
      "reference",
      "nom",
      "description_produit",
      "prix_unitaire",
      "quantite_stock",
      "id_categorie",
      "id_fournisseur",
    ];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        res.status(404).json({ error: `Le champ '${field}' est requis` });
      }
    });

    await connection.beginTransaction();

    // Ajouter le produit
    const [row] = await connection.execute(
      "INSERT INTO produits (reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur]
    );

    // Récupérer le produit ajouté
    const [result] = await connection.execute("SELECT * FROM produits WHERE id = ?", [row.insertId]);

    await connection.commit();

    res.status(201).json({ message: "Produit ajouté", result: result[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de l'ajout du produit: ", error);
    res.status(500).json({ error: "Échec lors de l'ajout du produit", details: error.message });
  } finally {
    await connection.end();
  }
});

// PUT
app.put("/produits/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = [
      "reference",
      "nom",
      "description_produit",
      "prix_unitaire",
      "quantite_stock",
      "id_categorie",
      "id_fournisseur",
    ];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        res.status(404).json({ error: `Le champ '${field}' est requis` });
      }
    });

    // Vérifier si le produit existe
    const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id]);

    if (!produit.length) {
      res.status(404).json({ error: "Produit non trouvé" });
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

    res.status(200).json({ message: "Produit mis à jour", result: result[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la mise à jour du produit: ", error);
    res.status(500).json({ error: "Échec lors de la mise à jour du produit", details: error.message });
  } finally {
    await connection.end();
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
    await connection.end();
  }
});

// FOURNISSEURS CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/fournisseurs", async (req, res) => {
  const connection = await dbConnection();

  try {
    // Récupérer tous les fournisseurs
    const [result] = await connection.execute("SELECT * FROM fournisseurs");

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des fournisseurs: ", error);
    res.status(500).json({ error: "Échec lors de la récupération des fournisseurs", details: error.message });
  } finally {
    await connection.end();
  }
});

// GET ONE
app.get("/fournisseurs/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  try {
    // Récupérer le fournisseur
    const [result] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [id]);

    if (!result.length) {
      res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du fournisseur: ", error);
    res.status(500).json({ error: "Échec lors de la récupération du fournisseur", details: error.message });
  } finally {
    await connection.end();
  }
});

// POST
app.post("/fournisseurs", async (req, res) => {
  const connection = await dbConnection();
  const { nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;
  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = ["nom", "numero_adresse", "rue_adresse", "code_postal", "ville", "telephone", "email"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        res.status(404).json({ error: `Le champ '${field}' est requis` });
      }
    });

    await connection.beginTransaction();

    // Ajouter le fournisseur
    const [row] = await connection.execute(
      "INSERT INTO fournisseurs (nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email]
    );

    // Récupérer le fournisseur ajouté
    const [result] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [row.insertId]);

    await connection.commit();

    res.status(201).json({ message: "Fournisseur ajouté", result: result[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de l'ajout du fournisseur: ", error);
    res.status(500).json({ error: "Échec lors de l'ajout du fournisseur", details: error.message });
  } finally {
    await connection.end();
  }
});

// PUT
app.put("/fournisseurs/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = ["nom", "numero_adresse", "rue_adresse", "code_postal", "ville", "telephone", "email"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        res.status(404).json({ error: `Le champ '${field}' est requis` });
      }
    });

    // Vérifier si le fournisseur existe
    const [fournisseur] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [id]);

    if (!fournisseur.length) {
      res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    await connection.beginTransaction();

    // Mettre à jour le fournisseur
    await connection.execute(
      "UPDATE fournisseurs SET nom = ?, numero_adresse = ?, rue_adresse = ?, code_postal = ?, ville = ?, telephone = ?, email = ? WHERE id = ?",
      [nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email, id]
    );

    // Récupérer le fournisseur mis à jour
    const [result] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [id]);

    await connection.commit();

    res.status(200).json({ message: "Fournisseur mis à jour", result: result[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la mise à jour du fournisseur: ", error);
    res.status(500).json({ error: "Échec lors de la mise à jour du fournisseur", details: error.message });
  } finally {
    await connection.end();
  }
});

// DELETE
app.delete("/fournisseurs/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Verifier si le fournisseur existe
    const [fournisseur] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [id]);
    if (!fournisseur.length) {
      return res.status(404).json({ message: "Fournisseur non trouvé" });
    }

    await connection.beginTransaction();

    // Supprimé le fournisseur
    await connection.execute("DELETE FROM fournisseurs WHERE id = ?", [id]);

    await connection.commit();

    res.status(200).json({ message: "Fournisseur supprimé" });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la suppression du fournisseur: ", error);
    res.status(500).json({ error: "Échec lors de la suppression du fournisseur", details: error.message });
  } finally {
    await connection.end();
  }
});

// CLIENTS CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/clients", async (req, res) => {
  const connection = await dbConnection();

  try {
    // Récupérer tous les clients
    const [result] = await connection.execute("SELECT * FROM clients");

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients: ", error);
    res.status(500).json({ error: "Échec lors de la récupération des clients", details: error.message });
  } finally {
    await connection.end();
  }
});

// GET ONE
app.get("/clients/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Récupérer le client
    const [result] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id]);

    if (!result.length) {
      res.status(404).json({ error: "Client non trouvé" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du client: ", error);
    res.status(500).json({ error: "Échec lors de la récupération du client", details: error.message });
  } finally {
    await connection.end();
  }
});

// POST
app.post("/clients", async (req, res) => {
  const connection = await dbConnection();
  const { nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = [
      "nom",
      "prenom",
      "numero_adresse",
      "rue_adresse",
      "code_postal",
      "ville",
      "telephone",
      "email",
    ];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        res.status(404).json({ error: `Le champ '${field}' est requis` });
      }
    });

    await connection.beginTransaction();

    // Ajouter le client
    const [row] = await connection.execute(
      "INSERT INTO clients (nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email]
    );

    // Récupérer le client ajouté
    const [result] = await connection.execute("SELECT * FROM clients WHERE id = ?", [row.insertId]);

    await connection.commit();

    res.status(201).json({ message: "Client ajouté", result: result[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de l'ajout du client: ", error);
    res.status(500).json({ error: "Échec lors de l'ajout du client", details: error.message });
  } finally {
    await connection.end();
  }
});

// PUT
app.put("/clients/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;
  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = [
      "nom",
      "prenom",
      "numero_adresse",
      "rue_adresse",
      "code_postal",
      "ville",
      "telephone",
      "email",
    ];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        res.status(404).json({ error: `Le champ '${field}' est requis` });
      }
    });

    // Récupérer le client
    const [client] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id]);

    if (!client.length) {
      res.status(404).json({ error: "Client non trouvé" });
    }

    await connection.beginTransaction();

    // Mettre à jour le client
    await connection.execute(
      "UPDATE clients SET nom = ?, prenom = ?, numero_adresse = ?, rue_adresse = ?, code_postal = ?, ville = ?, telephone = ?, email = ? WHERE id = ?",
      [nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email, id]
    );

    // Récupérer le client mis à jour
    const [result] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id]);

    await connection.commit();

    res.status(200).json({ message: "Client mis à jour", result: result[0] });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la mise à jour du client: ", error);
    res.status(500).json({ error: "Échec lors de la mise à jour du client", details: error.message });
  } finally {
    await connection.end();
  }
});

// DELETE
app.delete("/clients/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Vérifier si le client existe
    const [client] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id]);

    if (!client.length) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    await connection.beginTransaction();

    // Supprimer le client
    await connection.execute("DELETE FROM clients WHERE id = ?", [id]);

    await connection.commit();

    res.status(200).json({ message: "Client supprimé" });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la suppression du client: ", error);
    res.status(500).json({ error: "Échec lors de la suppression du client", details: error.message });
  } finally {
    await connection.end();
  }
});

// COMMANDE CRUD //////////////////////////////////////////////////////////////////////////////
// GET ALL
app.get("/commandes", async (req, res) => {
  const connection = await dbConnection();
  const result = [];

  try {
    // Récupérer toutes les commandes
    const [commandes] = await connection.execute("SELECT * FROM commandes");

    // Récupérer les lignes de commande pour chaque commande
    for (const commande of commandes) {
      const [lignes_commande] = await connection.execute("SELECT * FROM lignes_commandes WHERE id_commande = ?", [
        commande.id,
      ]);
      // Formater la date de commande
      commande.date_commande = new Date(commande.date_commande).toISOString().split("T")[0];
      // Ajouter la commande et ses lignes de commande au résultat
      result.push({ commande, lignes_commande });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des commandes", details: error.message });
  } finally {
    await connection.end();
  }
});

// GET ONE
app.get("/commandes/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Récupérer la commande
    const [commande] = await connection.execute("SELECT * FROM commandes WHERE id = ?", [id]);
    // Formater la date de commande
    commande[0].date_commande = new Date(commande[0].date_commande).toISOString().split("T")[0];

    // Vérifier si la commande existe
    if (!commande.length) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Récupérer les lignes de commande pour la commande
    const [lignes_commande] = await connection.execute("SELECT * FROM lignes_commandes WHERE id_commande = ?", [id]);

    return res.status(200).json({ commande: commande[0], lignes_commande });
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération de la commande", details: error.message });
  } finally {
    await connection.end();
  }
});

// POST
app.post("/commandes", async (req, res) => {
  const connection = await dbConnection();
  const { date_commande, id_client, lignes_commandes } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés pour la commande
    const requiredFields = ["date_commande", "id_client", "lignes_commandes"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        return res.status(404).json({ error: `Le champ '${field}' est requis pour la commande` });
      }
    });

    // Vérifier si les champs obligatoires sont renseignés pour les lignes de commande
    const lignesCommandesRequiredFields = ["id_produit", "quantite"];
    lignesCommandesRequiredFields.forEach((field) => {
      lignes_commandes.forEach((ligne) => {
        if (!ligne[field]) {
          return res.status(404).json({ error: `Le champ '${field}' est requis pour les lignes commandes` });
        }
      });
    });

    // Vérifier si la date de commande est au bon format
    if (!Date.parse(date_commande)) {
      return res
        .status(404)
        .json({ error: "Le format de la date de commande est invalide", message: "Format: YYYY-DD-MM" });
    }

    // Vérifier si le client existe
    const [client] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id_client]);
    if (!client.length) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    await connection.beginTransaction();

    // Ajouter la commande
    const [commande] = await connection.execute("INSERT INTO commandes (date_commande, id_client) VALUES (?, ?)", [
      date_commande,
      id_client,
    ]);

    // Ajouter les lignes commande
    for (const ligne of lignes_commandes) {
      const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [ligne.id_produit]);
      // Vérifier si le produit existe
      if (!produit.length) {
        await connection.rollback();
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      // Vérifier si la quantité de produit est suffisante
      else if (produit[0].quantite_stock < ligne.quantite) {
        await connection.rollback();
        return res.status(404).json({
          error: `Quantité de produit '${produit[0].reference} - ${produit[0].nom}' insuffisante`,
          message: `Quantité en stock: ${produit[0].quantite_stock}`,
        });
      }

      // Vérifier si la quantité est supérieurs à 0
      if (ligne.quantite <= 0) {
        await connection.rollback();
        return res.status(404).json({
          error: "La quantité de produit doit être supérieure à 0",
        });
      }

      // Ajouter la ligne de commande
      await connection.execute(
        "INSERT INTO lignes_commandes (id_commande, id_produit, quantite, prix_unitaire) VALUES (?,?,?,?)",
        [commande.insertId, ligne.id_produit, ligne.quantite, produit[0].prix_unitaire]
      );
    }

    await connection.commit();

    // Récupérer la commande ajoutée
    const [resultCommande] = await connection.execute("SELECT * FROM commandes WHERE id = ?", [commande.insertId]);
    // Formater la date de commande
    resultCommande[0].date_commande = new Date(resultCommande[0].date_commande).toISOString().split("T")[0];

    // Récupérer les lignes de commande ajoutées
    const [resultLignesCommande] = await connection.execute("SELECT * FROM lignes_commandes WHERE id_commande = ?", [
      commande.insertId,
    ]);

    return res
      .status(201)
      .json({ message: "Commande ajoutée", commande: resultCommande[0], lignes_commande: resultLignesCommande });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de l'ajout de la commande: ", error);
    return res.status(500).json({ error: "Échec lors de l'ajout de la commande", details: error.message });
  } finally {
    await connection.end();
  }
});

// PUT
app.put("/commandes/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { date_commande, id_client, lignes_commandes } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés pour la commande
    const requiredFields = ["date_commande", "id_client", "lignes_commandes"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        return res.status(404).json({ error: `Le champ '${field}' est requis pour la commande` });
      }
    });

    // Vérifier si les champs obligatoires sont renseignés pour les lignes de commande
    const lignesCommandesRequiredFields = ["id_produit", "quantite"];
    lignes_commandes.forEach((ligne) => {
      lignesCommandesRequiredFields.forEach((field) => {
        if (!ligne[field]) {
          return res.status(404).json({ error: `Le champ '${field}' est requis pour les lignes commandes` });
        }
      });
    });

    // Vérifier si la date de commande est au bon format
    if (!Date.parse(date_commande)) {
      return res
        .status(404)
        .json({ error: "Le format de la date de commande est invalide", message: "Format: YYYY-DD-MM" });
    }

    // Vérifier si la commande existe
    const [result] = await connection.execute("SELECT * FROM commandes WHERE id = ?", [id]);
    if (!result.length) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Vérifier si le client existe
    const [client] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id_client]);
    if (!client.length) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    await connection.beginTransaction();

    // Mettre à jour la commande
    await connection.execute("UPDATE commandes SET date_commande = ?, id_client = ? WHERE id = ?", [
      date_commande,
      id_client,
      id,
    ]);

    // Supprimer les lignes de commande de la commande
    await connection.execute("DELETE FROM lignes_commandes WHERE id_commande = ?", [id]);

    // Mettre à jour les lignes de commande
    for (const ligne of lignes_commandes) {
      const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [ligne.id_produit]);
      // Vérifier si le produit existe
      if (!produit.length) {
        await connection.rollback();
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      // Vérifier si la quantité de produit est suffisante
      else if (produit[0].quantite_stock < ligne.quantite) {
        await connection.rollback();
        return res.status(404).json({
          error: `Quantité de produit '${produit[0].reference} - ${produit[0].nom}' insuffisante`,
          message: `Quantité en stock: ${produit[0].quantite_stock}`,
        });
      }

      // Vérifier si la quantité est supérieurs à 0
      if (ligne.quantite <= 0) {
        await connection.rollback();
        return res.status(404).json({
          error: "La quantité de produit doit être supérieure à 0",
        });
      }

      // Ajouter la ligne de commande
      await connection.execute(
        "INSERT INTO lignes_commandes (id_commande, id_produit, quantite, prix_unitaire) VALUES (?,?,?,?)",
        [id, ligne.id_produit, ligne.quantite, produit[0].prix_unitaire]
      );
    }

    await connection.commit();

    // Récupérer la commande mise à jour
    const [resultCommande] = await connection.execute("SELECT * FROM commandes WHERE id = ?", [id]);
    // Formater la date de commande
    resultCommande[0].date_commande = new Date(resultCommande[0].date_commande).toISOString().split("T")[0];

    // Récupérer les lignes de commande mises à jour
    const [resultLignesCommande] = await connection.execute("SELECT * FROM lignes_commandes WHERE id_commande = ?", [
      id,
    ]);

    return res
      .status(201)
      .json({ message: "Commande mise à jour", commande: resultCommande[0], lignes_commande: resultLignesCommande });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la mise à jour de la commande: ", error);
    return res.status(500).json({ error: "Échec lors de la mise à jour de la commande", details: error.message });
  } finally {
    await connection.end();
  }
});

// DELETE
app.delete("/commandes/:id", async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  try {
    // Vérifier si la commande existe
    const [commande] = await connection.execute("SELECT * FROM commandes WHERE id = ?", [id]);
    if (!commande.length) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    await connection.beginTransaction();

    // Supprimer les lignes de commande de la commande
    await connection.execute("DELETE FROM lignes_commandes WHERE id_commande = ?", [id]);

    // Supprimer la commande
    await connection.execute("DELETE FROM commandes WHERE id = ?", [id]);

    await connection.commit();

    return res.status(200).json({ message: "Commande supprimée ainsi que les lignes de commande associées" });
  } catch (error) {
    await connection.rollback();
    console.error("Erreur lors de la suppression de la commande: ", error);
    return res.status(500).json({ error: "Échec lors de la suppression de la commande", details: error.message });
  } finally {
    await connection.end();
  }
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
