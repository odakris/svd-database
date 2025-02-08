// Query par défaut pour récupérer les commandes
const defaultQuery = `
    SELECT
      c.id,
      c.date_commande,
      c.id_client,
      c.prix_total,
      lc.id AS ligne_id,
      lc.id_produit,
      lc.quantite,
      lc.prix_unitaire,
      lc.total_ligne
    FROM commandes c
    JOIN lignes_commandes lc ON c.id = lc.id_commande`;

// Récupérer les commandes avec un filtre optionel
const getCommands = async (connection, queryConditions, queryParams = []) => {
  try {
    // Créer la requête
    const query = `${defaultQuery} ${queryConditions}`;
    // Exécuter la requête
    const [rows] = await connection.execute(query, queryParams);

    // Si aucune commande n'est trouvée, renvoyer un tableau vide
    if (!rows.length) {
      return [];
    }

    // Regrouper les commandes par ID
    const commandes = {};
    rows.forEach((row) => {
      if (!commandes[row.id]) {
        commandes[row.id] = {
          id: row.id,
          date_commande: new Date(row.date_commande).toISOString().split("T")[0],
          id_client: row.id_client,
          prix_total: row.prix_total,
          lignes_commandes: [],
        };
      }

      // Ajouter les lignes de commande à la commande correspondante
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

    // Renvoyer un tableau des commandes
    return Object.values(commandes);
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête : ", error);
    return [];
  }
};

module.exports = { getCommands };
