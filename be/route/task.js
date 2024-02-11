const express = require('express')
const router = express.Router()
const taskController = require('../service/task')

router.get("", taskController.getAllTask)
router.post("", taskController.createTask)
router.put("/:id", taskController.updateTask)
router.delete("/:id", taskController.deleteTask)

module.exports = router