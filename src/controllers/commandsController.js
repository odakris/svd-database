const { dbConnection } = require("../db/dbConnection");
const { getCommands } = require("../utils/getCommands");

// Récupérer toutes les commandes
const getAllCommands = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  // if (!connection) {
  //   return;
  // }

  const { start, end, id_client, id_produit, prix_min, prix_max } = req.query;
  const queryParams = [];
  let queryCondition = "WHERE ";
  const filter = [];

  // Vérifier si les dates de début et de fin sont renseignées
  if (start && end) {
    // Vérifier si les dates de début et de fin sont au bon format
    if (!Date.parse(start) || !Date.parse(end)) {
      return res
        .status(400)
        .json({ error: "Le format des dates de début et de fin est invalide", message: "Format: YYYY-DD-MM" });
    }
    filter.push("c.date_commande BETWEEN ? AND ?");
    queryParams.push(start, end);
  }
  // Vérifier si seulement la date de début est renseignée
  else if (start && !end) {
    filter.push("c.date_commande > ?");
    queryParams.push(start);
  }
  // Vérifier si seulement la date de fin est renseignée
  else if (!start && end) {
    filter.push("c.date_commande < ?");
    queryParams.push(end);
  }

  // Vérifier si id_client est renseigné
  if (id_client) {
    filter.push("c.id_client = ?");
    queryParams.push(id_client);
  }

  // Vérifier si id_produit est renseigné
  if (id_produit) {
    filter.push("lc.id_produit = ?");
    queryParams.push(id_produit);
  }

  // Vérifier si le prix_min est renseigné
  if (prix_min) {
    filter.push("c.prix_total >= ?");
    queryParams.push(prix_min);
  }

  // Vérifier si le prix_max est renseigné
  if (prix_max) {
    filter.push("c.prix_total <= ?");
    queryParams.push(prix_max);
  }

  // Définir la condition de la requête
  if (filter.length) {
    queryCondition += filter.join(" AND ");
  } else {
    queryCondition = "";
  }

  try {
    // Récupérer les commandes
    const commands = await getCommands(connection, queryCondition, queryParams);

    if (!commands.length) {
      return res.status(404).json({ message: "Aucune commande trouvée" });
    }

    return res.status(200).json(commands);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des commandes", details: error.message });
  } finally {
    await connection.end();
  }
};

// Récupérer une commande par son ID
const getCommandById = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  const queryCondition = "WHERE c.id = ?";
  const queryParams = [id];
  try {
    // Récupérer la commande
    const commandes = await getCommands(connection, queryCondition, queryParams);

    if (!commandes.length) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    return res.status(200).json(commandes);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération de la commande", details: error.message });
  } finally {
    await connection.end();
  }
};

// Ajouter une commande
const createCommand = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

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

    const queryCondition = "WHERE c.id = ?";
    const queryParams = [commande.insertId];
    // Récupérer la commande ajoutée
    const resultCommand = await getCommands(connection, queryCondition, queryParams);

    return res.status(201).json({ message: "Commande ajoutée", commande: resultCommand });
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
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

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

    const queryCondition = "WHERE c.id = ?";
    const queryParams = [id];

    // Récupérer la commande mise à jour
    const resultCommand = await getCommands(connection, queryCondition, queryParams);

    return res.status(201).json({ message: "Commande mise à jour", commande: resultCommand });
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
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

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
