const { query } = require("express");
const dbConnection = require("../db/dbConnection");
const { getCommands } = require("../utils/getCommands");

// Récupérer tous les produits
const getAllProducts = async (req, res) => {
  const connection = await dbConnection();

  try {
    // Récupérer tous les produits
    const [result] = await connection.execute("SELECT * FROM produits");

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des produits", details: error.message });
  } finally {
    await connection.end();
  }
};

// Récupérer un produit par son ID
const getProductById = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Récupérer le produit
    const [result] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id]);

    if (!result.length) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération du produit", details: error.message });
  } finally {
    await connection.end();
  }
};

// Récupérer les commandes par ID produit
const getCommandsByProductId = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  const queryCondition = "WHERE lc.id_produit = ?";
  const queryParams = [id];

  try {
    // Récupérer les commandes par ID produit
    const commandes = await getCommands(connection, queryCondition, queryParams);

    // Si aucune commande n'est trouvée
    if (!commandes.length) {
      return res.status(404).json({ message: "Aucune commande trouvée pour ce produit" });
    }

    return res.status(200).json(commandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes par produit: ", error);
    return res
      .status(500)
      .json({ error: "Échec lors de la récupération des commandes par produit", details: error.message });
  } finally {
    await connection.end();
  }
};

// Récupérer les produits avec un stock faible
const getLowStockProducts = async (req, res) => {
  const connection = await dbConnection();
  const { seuil } = req.query;
  let seuilValue = 10;

  if (seuil) {
    // Vérifier si le seuil est un nombre
    if (seuil <= 0 || isNaN(seuil)) {
      return res.status(400).json({ error: "Le seuil doit être un nombre valide" });
    }
    seuilValue = parseInt(seuil);
  }

  try {
    // Récupérer les produits avec un stock faible
    const [result] = await connection.execute(
      `SELECT reference, nom, description_produit, quantite_stock FROM produits WHERE quantite_stock < ? ORDER BY quantite_stock ASC`,
      [seuilValue]
    );

    // Si aucun produit n'est trouvé
    if (!result.length) {
      return res.status(404).json({ message: `Aucun produit avec un stock inférieur à ${seuilValue}` });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des produits", details: error.message });
  } finally {
    await connection.end();
  }
};

// Ajouter un produit
const createProduct = async (req, res) => {
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
        return res.status(400).json({ error: `Le champ '${field}' est requis` });
      }
    });

    // Vérifier si la quantité et le prix unitaire sont supérieurs à 0
    if (quantite_stock <= 0) {
      return res.status(400).json({
        error: "La quantité de produit doit être supérieure à 0",
      });
    } else if (prix_unitaire <= 0) {
      return res.status(400).json({
        error: "Le prix unitaire de produit doit être supérieur à 0",
      });
    }

    // Vérifier si la catégorie existe
    const [categorie] = await connection.execute("SELECT * FROM categories WHERE id = ?", [id_categorie]);
    if (!categorie.length) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    // Vérifier si le fournisseur existe
    const [fournisseur] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [id_fournisseur]);
    if (!fournisseur.length) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
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

    return res.status(201).json({ message: "Produit ajouté", result: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de l'ajout du produit: ", error);
    return res.status(500).json({ error: "Échec lors de l'ajout du produit", details: error.message });
  } finally {
    await connection.end();
  }
};

// Mettre à jour un produit
const updateProduct = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { reference, nom, description_produit, prix_unitaire, quantite_stock, id_categorie, id_fournisseur } = req.body;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

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
        return res.status(400).json({ error: `Le champ '${field}' est requis` });
      }
    });

    // Vérifier si le produit existe
    const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id]);
    if (!produit.length) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Vérifier si la quantité et le prix unitaire sont supérieurs à 0
    if (quantite_stock <= 0) {
      return res.status(404).json({
        error: "La quantité de produit doit être supérieure à 0",
      });
    } else if (prix_unitaire <= 0) {
      return res.status(400).json({
        error: "Le prix unitaire de produit doit être supérieur à 0",
      });
    }

    // Vérifier si la catégorie existe
    const [categorie] = await connection.execute("SELECT * FROM categories WHERE id = ?", [id_categorie]);
    if (!categorie.length) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    // Vérifier si le fournisseur existe
    const [fournisseur] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [id_fournisseur]);
    if (!fournisseur.length) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
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

    return res.status(200).json({ message: "Produit mis à jour", result: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la mise à jour du produit: ", error);
    return res.status(500).json({ error: "Échec lors de la mise à jour du produit", details: error.message });
  } finally {
    await connection.end();
  }
};

// Supprimer un produit
const deleteProduct = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Vérifier si le produit existe
    const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id]);

    if (!produit.length) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    await connection.beginTransaction();

    // Supprimer le produit
    try {
      await connection.execute("DELETE FROM produits WHERE id = ?", [id]);
    } catch (error) {
      await connection.rollback();
      return res.status(500).json({
        error: "Échec lors de la suppression du produit",
        message: "Le produit ne peut être supprimé s'il est lié à une commande",
        details: error,
      });
    }

    await connection.commit();

    return res.status(200).json({ message: "Produit supprimé" });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la suppression du produit: ", error);
    return res.status(500).json({ error: "Échec lors de la suppression du produit", details: error.message });
  } finally {
    await connection.end();
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getCommandsByProductId,
  getLowStockProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
