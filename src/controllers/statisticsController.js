const { dbConnection } = require("../db/dbConnection");

const getTopProducts = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  let query = `
  SELECT
      p.nom,
      p.description_produit,
      p.prix_unitaire,
      p.quantite_stock,
      COUNT(lc.quantite) AS total_ventes
  FROM produits p
  JOIN lignes_commandes lc ON p.id = lc.id_produit
  GROUP BY p.id	
  ORDER BY total_ventes DESC
  LIMIT 3`;

  try {
    // Récupérer les produits
    const result = await connection.execute(query);

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération des top produits: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des top produits", details: error.message });
  } finally {
    await connection.end();
  }
};

const getTopClients = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  let query = `
  SELECT
      nom,
      prenom,
      COUNT(c.id_client) AS nombre_commandes
  FROM clients cl
  JOIN commandes c ON cl.id = c.id_client
  GROUP BY cl.id	
  ORDER BY nombre_commandes DESC
  LIMIT 3`;

  try {
    // Récupérer les clients
    const result = await connection.execute(query);

    // Si aucun client n'est trouvé
    if (!result[0].length) {
      return res.status(404).json({ error: "Aucun client trouvé" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération des top clients: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des top clients", details: error.message });
  } finally {
    await connection.end();
  }
};

const getTopSuppliers = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  let query = `
  SELECT
    f.nom,
    COUNT(lc.quantite) AS nombre_commandes
  FROM fournisseurs f
  JOIN produits p ON f.id = p.id_fournisseur
    JOIN lignes_commandes lc ON p.id = lc.id_produit
  GROUP BY f.id
  ORDER BY nombre_commandes DESC
  LIMIT 3`;

  try {
    // Récupérer les fournisseurs
    const result = await connection.execute(query);

    // Si aucun fournisseur n'est trouvé
    if (!result[0].length) {
      return res.status(404).json({ error: "Aucun fournisseur trouvé" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération des top fournisseurs: ", error);
    return res
      .status(500)
      .json({ error: "Échec lors de la récupération des top fournisseurs", details: error.message });
  } finally {
    await connection.end();
  }
};

const getTotalSales = async (req, res) => {
  const role = req.headers["role"];
  const connection = await dbConnection(role, res);

  const { start, end } = req.query;

  let query = `
  SELECT
    SUM(lc.total_ligne) AS total_ventes
  FROM lignes_commandes lc
  JOIN commandes c ON lc.id_commande = c.id`;

  const queryParams = [];
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

  if (filter.length) {
    query += ` WHERE ${filter}`;
  }

  try {
    // Récupérer les ventes totales
    const result = await connection.execute(query, queryParams);

    // Si aucune vente n'est trouvée
    if (!result[0].length) {
      return res.status(404).json({ error: "Aucune vente trouvée" });
    }

    return res.status(200).json(result[0][0]);
  } catch (error) {
    console.error("Erreur lors de la récupération des ventes totales: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des ventes totales", details: error.message });
  } finally {
    await connection.end();
  }
};

module.exports = { getTopProducts, getTopClients, getTopSuppliers, getTotalSales };
