const {
  addEventToGoogleCalendar,
  deleteEventFromGoogleCalendar,
} = require("../utils/googleCalendar");
const CalendarEvent = require("../models/CalendarEvent");
const Task = require("../models/Task");

exports.syncWithGoogleCalendar = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const { taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée." });

    const event = {
      titre: task.titre,
      description: task.description,
      date: task.dateEchance,
    };

    const googleEvent = await addEventToGoogleCalendar(event);

    if (!googleEvent.id) {
      return res
        .status(500)
        .json({ message: "Erreur : Événement non ajouté à Google Calendar." });
    }

    const calendarEvent = new CalendarEvent({
      eventId: googleEvent.id,
      titre: task.titre,
      description: task.description,
      date: task.dateEcheance,
      utilisateur: req.user.id,
    });

    await calendarEvent.save();

    res
      .status(201)
      .json({
        message: "Tâche synchronisée avec Google Calendar.",
        calendarEvent,
      });
  } catch (error) {
    console.error("Erreur Google Calendar:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la synchronisation avec Google Calendar.",
      });
  }
};

exports.deleteCalendarEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    await deleteEventFromGoogleCalendar(eventId);
    await CalendarEvent.findOneAndDelete({ eventId });

    res
      .status(200)
      .json({
        message:
          "Événement supprimé de Google Calendar et de la base de données.",
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l’événement." });
  }
};
