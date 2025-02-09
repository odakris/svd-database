const { dbConnection } = require("../db/dbConnection");

// Récupérer toutes les lignes
const getAllLines = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  try {
    // Récupérer toutes les lignes de commandes
    const [result] = await connection.execute("SELECT * FROM lignes_commandes");

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des lignes de commandes: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des lignes de commandes", details: error });
  } finally {
    await connection.end();
  }
};

// Récupérer une ligne par son id
const getLineById = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Récupérer la ligne de commande
    const [result] = await connection.execute("SELECT * FROM lignes_commandes WHERE id = ?", [id]);

    if (!result.length) {
      return res.status(404).json({ error: "Ligne de commande non trouvée" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la ligne de commande: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération de la ligne de commande", details: error });
  } finally {
    await connection.end();
  }
};

// Créer une ligne
const createLine = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  const { id_produit, id_commande, quantite } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = ["id_produit", "id_commande", "quantite"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Le champ ${field} est obligatoire` });
      }
    });

    // Vérifier si le produit existe
    const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id_produit]);
    if (!produit.length) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Vérifier si la commande existe
    const [commande] = await connection.execute("SELECT * FROM commandes WHERE id = ?", [id_commande]);
    if (!commande.length) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Vérifier si la quantité est supérieure à 0
    if (quantite <= 0) {
      return res.status(400).json({ error: "La quantité doit être supérieure à 0" });
    } else if (quantite > produit[0].quantite_stock) {
      return res.status(400).json({
        error: `Quantité de produit '${produit[0].reference} - ${produit[0].nom}' insuffisante`,
        message: `Quantité en stock: ${produit[0].quantite_stock}`,
      });
    }

    await connection.beginTransaction();

    // Créer la ligne de commande
    const [row] = await connection.execute(
      "INSERT INTO lignes_commandes (id_produit, id_commande, quantite, prix_unitaire) VALUES (?, ?, ?, ?)",
      [id_produit, id_commande, quantite, produit[0].prix_unitaire]
    );

    await connection.commit();

    // Récupérer la ligne de commande créée
    const [result] = await connection.execute("SELECT * FROM lignes_commandes WHERE id = ?", [row.insertId]);

    return res.status(201).json({ message: "Ligne de commande créée avec succès", ligne: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la création de la ligne de commande: ", error);
    return res.status(500).json({ error: "Échec lors de la création de la ligne de commande", details: error });
  } finally {
    await connection.end();
  }
};

// Mettre à jour une ligne
const updateLine = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  const { id } = req.params;
  const { id_produit, id_commande, quantite } = req.body;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Vérifier si la ligne de commande existe
    const [ligne] = await connection.execute("SELECT * FROM lignes_commandes WHERE id = ?", [id]);
    if (!ligne.length) {
      return res.status(404).json({ error: "Ligne de commande non trouvée" });
    }

    // Vérifier si le produit existe
    const [produit] = await connection.execute("SELECT * FROM produits WHERE id = ?", [id_produit]);
    if (!produit.length) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    // Vérifier si la commande existe
    const [commande] = await connection.execute("SELECT * FROM commandes WHERE id = ?", [id_commande]);
    if (!commande.length) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Vérifier si la quantité est supérieure à 0
    if (quantite <= 0) {
      return res.status(400).json({ error: "La quantité doit être supérieure à 0" });
    } else if (quantite > produit[0].quantite_stock) {
      return res.status(400).json({
        error: `Quantité de produit '${produit[0].reference} - ${produit[0].nom}' insuffisante`,
        message: `Quantité en stock: ${produit[0].quantite_stock}`,
      });
    }

    await connection.beginTransaction();

    // Mettre à jour la ligne de commande
    await connection.execute(
      "UPDATE lignes_commandes SET id_produit = ?, id_commande = ?, quantite = ? , prix_unitaire = ? WHERE id = ?",
      [id_produit, id_commande, quantite, produit[0].prix_unitaire, id]
    );

    // Récupérer la ligne de commande mise à jour
    const [result] = await connection.execute("SELECT * FROM lignes_commandes WHERE id = ?", [id]);

    await connection.commit();

    return res.status(200).json({ message: "Ligne de commande mise à jour", ligne: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la mise à jour de la ligne de commande: ", error);
    return res.status(500).json({ error: "Échec lors de la mise à jour de la ligne de commande", details: error });
  } finally {
    await connection.end();
  }
};

// Supprimer une ligne
const deleteLine = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Vérifier si la ligne de commande existe
    const [ligne] = await connection.execute("SELECT * FROM lignes_commandes WHERE id = ?", [id]);
    if (!ligne.length) {
      return res.status(404).json({ error: "Ligne de commande non trouvée" });
    }

    await connection.beginTransaction();

    // Supprimer la ligne de commande
    try {
      await connection.execute("DELETE FROM lignes_commandes WHERE id = ?", [id]);
    } catch (error) {
      await connection.rollback();
      return res.status(500).json({ error: "Échec lors de la suppression de la ligne de commande", details: error });
    }

    await connection.commit();

    return res.status(200).json({ message: "Ligne de commande supprimée" });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la suppression de la ligne de commande: ", error);
    return res.status(500).json({ error: "Échec lors de la suppression de la ligne de commande", details: error });
  } finally {
    await connection.end();
  }
};

module.exports = { getAllLines, getLineById, createLine, updateLine, deleteLine };
