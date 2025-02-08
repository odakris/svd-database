const dbConnection = require("../db/dbConnection");

// Récupérer toutes les commandes
const getAllCommands = async (req, res) => {
  const connection = await dbConnection();
  const { start, end } = req.query;
  const queryParams = [];

  let query = `
    SELECT 
      c.id, 
      c.date_commande, 
      c.id_client, 
      lc.id AS ligne_id, 
      lc.id_produit, 
      lc.quantite, 
      lc.prix_unitaire,
      lc.total_ligne
    FROM commandes c
    JOIN lignes_commandes lc ON c.id = lc.id_commande`;

  // Vérifier si les dates de début et de fin sont renseignées
  if (start && end) {
    // Vérifier si les dates de début et de fin sont au bon format
    if (!Date.parse(start) || !Date.parse(end)) {
      return res
        .status(400)
        .json({ error: "Le format des dates de début et de fin est invalide", message: "Format: YYYY-DD-MM" });
    }

    query += " WHERE c.date_commande BETWEEN ? AND ?";
    queryParams.push(start, end);
  }

  try {
    // Récupérer les commandes
    const [rows] = await connection.execute(query, queryParams);

    if (!rows.length) {
      return res.status(404).json({ error: "Aucune commande trouvée" });
    }

    // Regrouper les commandes par ID
    const commandes = {};
    rows.forEach((row) => {
      // Si la commande n'existe pas, l'ajouter
      if (!commandes[row.id]) {
        commandes[row.id] = {
          id: row.id,
          date_commande: new Date(row.date_commande).toISOString().split("T")[0],
          id_client: row.id_client,
          lignes_commandes: [],
        };
      }
      // Ajouter la ligne de commande à la commande
      if (row.ligne_id) {
        commandes[row.id].lignes_commandes.push({
          id: row.ligne_id,
          id_produit: row.id_produit,
          quantite: row.quantite,
          prix_unitaire: row.prix_unitaire,
          total_ligne: row.total_ligne,
        });
      }
    });

    return res.status(200).json(Object.values(commandes));
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des commandes", details: error.message });
  } finally {
    await connection.end();
  }
};

// Récupérer une commande par son ID
const getCommandById = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

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
};

// Ajouter une commande
const createCommand = async (req, res) => {
  const connection = await dbConnection();
  const { date_commande, id_client, lignes_commandes } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés pour la commande
    const requiredFields = ["date_commande", "id_client", "lignes_commandes"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Le champ '${field}' est requis pour la commande` });
      }
    });

    // Vérifier si les champs obligatoires sont renseignés pour les lignes de commande
    const lignesCommandesRequiredFields = ["id_produit", "quantite"];
    lignesCommandesRequiredFields.forEach((field) => {
      lignes_commandes.forEach((ligne) => {
        if (!ligne[field]) {
          return res.status(400).json({ error: `Le champ '${field}' est requis pour les lignes commandes` });
        }
      });
    });

    // Vérifier si la date de commande est au bon format
    if (!Date.parse(date_commande)) {
      return res
        .status(400)
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
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Erreur lors du rollback: ", rollbackError);
        }
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      // Vérifier si la quantité de produit est suffisante
      else if (produit[0].quantite_stock < ligne.quantite) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Erreur lors du rollback: ", rollbackError);
        }
        return res.status(400).json({
          error: `Quantité de produit '${produit[0].reference} - ${produit[0].nom}' insuffisante`,
          message: `Quantité en stock: ${produit[0].quantite_stock}`,
        });
      }

      // Vérifier si la quantité est supérieurs à 0
      if (ligne.quantite <= 0) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Erreur lors du rollback: ", rollbackError);
        }
        return res.status(400).json({
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
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de l'ajout de la commande: ", error);
    return res.status(500).json({ error: "Échec lors de l'ajout de la commande", details: error.message });
  } finally {
    await connection.end();
  }
};

// Mettre à jour une commande
const updateCommand = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { date_commande, id_client, lignes_commandes } = req.body;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Vérifier si les champs obligatoires sont renseignés pour la commande
    const requiredFields = ["date_commande", "id_client", "lignes_commandes"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Le champ '${field}' est requis pour la commande` });
      }
    });

    // Vérifier si les champs obligatoires sont renseignés pour les lignes de commande
    const lignesCommandesRequiredFields = ["id_produit", "quantite"];
    lignes_commandes.forEach((ligne) => {
      lignesCommandesRequiredFields.forEach((field) => {
        if (!ligne[field]) {
          return res.status(400).json({ error: `Le champ '${field}' est requis pour les lignes commandes` });
        }
      });
    });

    // Vérifier si la date de commande est au bon format
    if (!Date.parse(date_commande)) {
      return res
        .status(400)
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
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Erreur lors du rollback: ", rollbackError);
        }
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      // Vérifier si la quantité de produit est suffisante
      else if (produit[0].quantite_stock < ligne.quantite) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Erreur lors du rollback: ", rollbackError);
        }
        return res.status(400).json({
          error: `Quantité de produit '${produit[0].reference} - ${produit[0].nom}' insuffisante`,
          message: `Quantité en stock: ${produit[0].quantite_stock}`,
        });
      }

      // Vérifier si la quantité est supérieurs à 0
      if (ligne.quantite <= 0) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Erreur lors du rollback: ", rollbackError);
        }
        return res.status(400).json({
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
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la mise à jour de la commande: ", error);
    return res.status(500).json({ error: "Échec lors de la mise à jour de la commande", details: error.message });
  } finally {
    await connection.end();
  }
};

// Supprimer une commande
const deleteCommand = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

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
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la suppression de la commande: ", error);
    return res.status(500).json({ error: "Échec lors de la suppression de la commande", details: error.message });
  } finally {
    await connection.end();
  }
};

module.exports = { getAllCommands, getCommandById, createCommand, updateCommand, deleteCommand };
