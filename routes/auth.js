const express = require('express');
const router = express.Router();
const { sInscrire, seConnecter, mettreAJourProfil} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', sInscrire);
router.post('/login', seConnecter);
router.put('/profil', authMiddleware , mettreAJourProfil);

module.exports = router;