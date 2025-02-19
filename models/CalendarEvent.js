const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true }, // ID généré par Google Calendar
  titre: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Utilisateur lié
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
