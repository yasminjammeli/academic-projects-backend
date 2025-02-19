const express = require('express');
const router = express.Router();
const {createProject, getProjects, updateProject, deleteProject, addMember} = require('../controllers/projectController');
const authMiddleware =require('../middleware/authMiddleware');

//crud pour les projects
router.post('/' , authMiddleware, createProject);
router.get('/', authMiddleware, getProjects);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

router.post('/:id/members', authMiddleware,addMember);

module.exports = router;