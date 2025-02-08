const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");

router.get("/top-produits", statisticsController.getTopProducts);
router.get("/top-clients", statisticsController.getTopClients);
router.get("/top-fournisseurs", statisticsController.getTopSuppliers);
router.get("/total-ventes", statisticsController.getTotalSales);

// router.get("/:id", categoriesController.getCategoryById);
// router.post("/", categoriesController.createCategory);
// router.put("/:id", categoriesController.updateCategory);
// router.delete("/:id", categoriesController.deleteCategory);

module.exports = router;
