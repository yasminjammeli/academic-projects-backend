const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.sInscrire = async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });  // Cette fonction vient de Mongoose
        if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé.' });

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Créer un nouvel utilisateur
        const user = new User({ nom, email, motDePasse: hashedPassword });
        await user.save();

        res.status(200).json({ message: 'Utilisateur inscrit avec succès' });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);  // Affichage de l'erreur dans la console
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.seConnecter = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé.' });

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect.' });

        // Générer un token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user: { id: user._id, nom: user.nom, email: user.email } });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error); // ✅ Ajout du log
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.mettreAJourProfil = async (req, res) => {
    try {
        const { id } = req.user; // ID de l'utilisateur authentifié (extrait du token JWT)
        const { nom, email } = req.body;

        // Récupérer l'utilisateur
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

        // Mettre à jour les informations
        user.nom = nom || user.nom;
        user.email = email || user.email;
        await user.save();

        res.status(200).json({ message: 'Profil mis à jour avec succès', user });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error); // ✅ Ajout du log
        res.status(500).json({ message: 'Erreur serveur' });
    }
};