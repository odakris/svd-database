const express = require("express");
const router = express.Router();
const linesController = require("../controllers/linesController");

router.get("/", linesController.getAllLines);
router.get("/:id", linesController.getLineById);
router.post("/", linesController.createLine);
router.put("/:id", linesController.updateLine);
router.delete("/:id", linesController.deleteLine);

module.exports = router;
