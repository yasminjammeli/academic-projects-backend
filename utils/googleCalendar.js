const { google } = require('googleapis');
const { getOAuth2Client } = require('./googleAuth');

async function addEventToGoogleCalendar(event) {
  try {
    const oAuth2Client = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const googleEvent = {
      summary: event.titre,
      description: event.description,
      start: { dateTime: event.date.toISOString(), timeZone: "UTC" },
      end: { dateTime: new Date(event.date).toISOString(), timeZone: "UTC" } // Ajout du timeZone
    };
    

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: googleEvent,
    });

    return response.data;
  } catch (error) {
    console.error('Erreur Google Calendar:', error);
    throw new Error('Impossible d’ajouter l’événement à Google Calendar.');
  }
}

async function deleteEventFromGoogleCalendar(eventId) {
  try {
    const oAuth2Client = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
  } catch (error) {
    console.error('Erreur suppression Google Calendar:', error);
  }
}

module.exports = { addEventToGoogleCalendar, deleteEventFromGoogleCalendar };
