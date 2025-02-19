
require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Import des routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/taskRoutes');
const calendarRoutes = require('./routes/calendar');
const notificationRoutes = require('./routes/notificationRoutes');

// Configuration d'Express et du serveur HTTP
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB', err);
    process.exit(1); // Arrêter l'application si la connexion échoue
  });

// Routes API
app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('API Academic Projects');
});

// Initialisation de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log(`🔌 Nouvel utilisateur connecté : ${socket.id}`);

  // Gestion des notifications via les salles
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 L'utilisateur ${userId} a rejoint la salle des notifications`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Utilisateur déconnecté : ${socket.id}`);
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue.' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});

// Exporter app et io si nécessaire pour des tests ou d'autres modules
module.exports = { app, io };
