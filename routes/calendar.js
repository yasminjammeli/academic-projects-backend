const express = require('express');
const router = express.Router();
const { syncWithGoogleCalendar, deleteCalendarEvent } = require('../controllers/calendarController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/sync', authMiddleware, syncWithGoogleCalendar);
router.delete('/delete/:eventId', authMiddleware, deleteCalendarEvent);

module.exports = router;
