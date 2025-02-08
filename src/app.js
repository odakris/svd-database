const express = require("express");
const app = express();
app.use(express.json());

const categoriesRoutes = require("./routes/categoriesRoutes");
const productsRoutes = require("./routes/productsRoutes");
const suppliersRoutes = require("./routes/suppliersRoutes");
const clientsRoutes = require("./routes/clientsRoutes");
const commandsRoutes = require("./routes/commandsRoutes");
const linesRoutes = require("./routes/linesRoutes");

// Routes
app.use("/categories", categoriesRoutes);
app.use("/produits", productsRoutes);
app.use("/fournisseurs", suppliersRoutes);
app.use("/clients", clientsRoutes);
app.use("/commandes", commandsRoutes);
app.use("/lignes", linesRoutes);

module.exports = app;
