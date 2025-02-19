const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createNotification, getNotificationsByUser, getUnreadNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const router = express.Router();

 
//create notification
router.post('/', authMiddleware, createNotification);
//recuperer tous les notifications d'un utilisateur
router.get('/', authMiddleware, getNotificationsByUser);
//recuperer uniquement les notifications non lues
router.get('/unread', authMiddleware, getUnreadNotifications);
//Marquer une notification comme lues
router.put('/:id/read', authMiddleware , markAsRead);
//marquer toutes les notifications comme lues
router.put('/mark-all-read', authMiddleware , markAllAsRead);

module.exports = router;