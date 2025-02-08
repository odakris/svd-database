// Récupérer les commandes avec un éventuel filtre par date
const getCommands = async (connection, query, queryParams = []) => {
  try {
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
    throw new Error("Erreur lors de la récupération des commandes");
  }
};

module.exports = getCommands;
