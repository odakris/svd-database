const dbConnection = require("../db/dbConnection");

const getAllClients = async (req, res) => {
  const connection = await dbConnection();

  try {
    // Récupérer tous les clients
    const [result] = await connection.execute("SELECT * FROM clients");

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des clients", details: error.message });
  } finally {
    await connection.end();
  }
};

const getClientById = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Récupérer le client
    const [result] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id]);

    if (!result.length) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du client: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération du client", details: error.message });
  } finally {
    await connection.end();
  }
};

const createClient = async (req, res) => {
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
        return res.status(400).json({ error: `Le champ '${field}' est requis` });
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

    return res.status(201).json({ message: "Client ajouté", result: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de l'ajout du client: ", error);
    return res.status(500).json({ error: "Échec lors de l'ajout du client", details: error.message });
  } finally {
    await connection.end();
  }
};

const updateClient = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom, prenom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

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
        return res.status(400).json({ error: `Le champ '${field}' est requis` });
      }
    });

    // Récupérer le client
    const [client] = await connection.execute("SELECT * FROM clients WHERE id = ?", [id]);

    if (!client.length) {
      return res.status(404).json({ error: "Client non trouvé" });
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

    return res.status(200).json({ message: "Client mis à jour", result: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la mise à jour du client: ", error);
    return res.status(500).json({ error: "Échec lors de la mise à jour du client", details: error.message });
  } finally {
    await connection.end();
  }
};

const deleteClient = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

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

    return res.status(200).json({ message: "Client supprimé" });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la suppression du client: ", error);
    return res.status(500).json({ error: "Échec lors de la suppression du client", details: error.message });
  } finally {
    await connection.end();
  }
};

module.exports = { getAllClients, getClientById, createClient, updateClient, deleteClient };
