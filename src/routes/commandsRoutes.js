const express = require("express");
const router = express.Router();
const commandsController = require("../controllers/commandsController");

router.get("/", commandsController.getAllCommands);
router.get("/:id", commandsController.getCommandById);
router.post("/", commandsController.createCommand);
router.put("/:id", commandsController.updateCommand);
router.delete("/:id", commandsController.deleteCommand);

module.exports = router;
