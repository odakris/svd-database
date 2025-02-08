const app = require("./app");
const { initDB } = require("./db/dbInit");

// Initialisation de la base de données
app.post("/init", async (req, res) => {
  await initDB();
  return res.send("Base de données initialisée avec succès !");
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
