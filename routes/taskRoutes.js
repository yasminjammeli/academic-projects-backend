const express = require('express');
const router = express.Router();

const {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask,
    updateTaskStatus,
}= require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

//Routes CRUD pour les taches

router.post('/:projectId', authMiddleware, createTask);
router.get('/:projectId', authMiddleware, getTasksByProject);
router.put('/:taskId', authMiddleware, updateTask);
router.delete('/:taskId', authMiddleware, deleteTask);
router.put('/:taskId/status', authMiddleware, updateTaskStatus);

module.exports = router;
