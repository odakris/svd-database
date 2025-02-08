const dbConnection = require("../db/dbConnection");

// Récupérer tous les fournisseurs
const getAllSuppliers = async (req, res) => {
  const connection = await dbConnection();

  try {
    // Récupérer tous les fournisseurs
    const [result] = await connection.execute("SELECT * FROM fournisseurs");

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des fournisseurs: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des fournisseurs", details: error.message });
  } finally {
    await connection.end();
  }
};

// Récupérer un fournisseur par son ID
const getSupplierById = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Récupérer le fournisseur
    const [result] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [id]);

    if (!result.length) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du fournisseur: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération du fournisseur", details: error.message });
  } finally {
    await connection.end();
  }
};

// Ajouter un fournisseur
const createSupplier = async (req, res) => {
  const connection = await dbConnection();
  const { nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;

  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = ["nom", "numero_adresse", "rue_adresse", "code_postal", "ville", "telephone", "email"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Le champ '${field}' est requis` });
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

    return res.status(201).json({ message: "Fournisseur ajouté", result: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de l'ajout du fournisseur: ", error);
    return res.status(500).json({ error: "Échec lors de l'ajout du fournisseur", details: error.message });
  } finally {
    await connection.end();
  }
};

// Mettre à jour un fournisseur
const updateSupplier = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom, numero_adresse, rue_adresse, code_postal, ville, telephone, email } = req.body;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Vérifier si les champs obligatoires sont renseignés
    const requiredFields = ["nom", "numero_adresse", "rue_adresse", "code_postal", "ville", "telephone", "email"];
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Le champ '${field}' est requis` });
      }
    });

    // Vérifier si le fournisseur existe
    const [fournisseur] = await connection.execute("SELECT * FROM fournisseurs WHERE id = ?", [id]);

    if (!fournisseur.length) {
      return res.status(404).json({ error: "Fournisseur non trouvé" });
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

    return res.status(200).json({ message: "Fournisseur mis à jour", result: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la mise à jour du fournisseur: ", error);
    return res.status(500).json({ error: "Échec lors de la mise à jour du fournisseur", details: error.message });
  } finally {
    await connection.end();
  }
};

// Supprimer un fournisseur
const deleteSupplier = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

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

    return res.status(200).json({ message: "Fournisseur supprimé" });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la suppression du fournisseur: ", error);
    return res.status(500).json({ error: "Échec lors de la suppression du fournisseur", details: error.message });
  } finally {
    await connection.end();
  }
};

module.exports = { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };
