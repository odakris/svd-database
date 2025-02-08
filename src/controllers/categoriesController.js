const dbConnection = require("../db/dbConnection");

// Récupérer toutes les catégories
const getAllCategories = async (req, res) => {
  const connection = await dbConnection();

  try {
    // Récupérer toutes les catégories
    const [result] = await connection.execute("SELECT * FROM categories");

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération des catégories", details: error.message });
  } finally {
    await connection.end();
  }
};

// Récupérer une catégorie par son ID
const getCategoryById = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Récupérer la catégorie
    const [result] = await connection.execute("SELECT * FROM categories WHERE id = ?", [id]);

    // Vérifier si la catégorie existe
    if (!result.length) {
      return res.status(404).json({ error: "Catégorie non trouvée" });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie: ", error);
    return res.status(500).json({ error: "Échec lors de la récupération de la catégorie", details: error.message });
  } finally {
    await connection.end();
  }
};

// Ajouter une catégorie
const createCategory = async (req, res) => {
  const connection = await dbConnection();
  const { nom } = req.body;

  try {
    // Vérifier si le champ 'nom' est renseigné
    if (!nom) {
      return res.status(400).json({ error: "le champ 'nom' est requis" });
    }

    await connection.beginTransaction();

    // Ajouter la catégorie
    const [row] = await connection.execute("INSERT INTO categories (nom) VALUES (?)", [nom]);

    // Récupérer la catégorie ajoutée
    const [result] = await connection.execute("SELECT * FROM categories WHERE id = ?", [row.insertId]);

    await connection.commit();

    return res.status(201).json({ message: "Catégorie ajoutée", result: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de l'ajout de la catégorie: ", error);
    return res.status(500).json({ error: "Échec de l'ajout de la catégorie", details: error.message });
  } finally {
    await connection.end();
  }
};

// Mettre à jour une catégorie
const updateCategory = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;
  const { nom } = req.body;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

  try {
    // Vérifier si le champ 'nom' est renseigné
    if (!nom) {
      return res.status(400).json({ error: "le champ 'nom' est requis" });
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

    return res.status(200).json({ message: "Catégorie mise à jour", result: result[0] });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la mise à jour de la catégorie: ", error);
    return res.status(500).json({ error: "Échec de la mise à jour de la catégorie", details: error.message });
  } finally {
    await connection.end();
  }
};

// Supprimer une catégorie
const deleteCategory = async (req, res) => {
  const connection = await dbConnection();
  const { id } = req.params;

  // Vérifier si l'ID est un nombre
  if (isNaN(id)) {
    return res.status(400).json({ error: "L'ID doit être un nombre valide" });
  }

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
    return res.status(200).send("Catégorie supprimée");
  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Erreur lors du rollback: ", rollbackError);
    }
    console.error("Erreur lors de la suppression de la catégorie: ", error);
    return res.status(500).json({ error: "Échec de la suppression de la catégorie", details: error.message });
  } finally {
    await connection.end();
  }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
