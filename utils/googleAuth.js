const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');

const credentialsPath = path.join(__dirname, '../config/google-credentials.json');
const tokenPath = path.join(__dirname, '../config/google-token.json');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getOAuth2Client() {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath));
  const { client_id, client_secret, redirect_uris } = credentials.web;

  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Ouvrez ce lien dans votre navigateur et autorisez l’application :', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Entrez le code fourni après l’autorisation : ', async (code) => {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync(tokenPath, JSON.stringify(tokens));
      console.log('Token enregistré dans', tokenPath);
    } catch (error) {
      console.error('Erreur lors de la récupération du token :', error.message);
    }
    rl.close();
  });
}

function checkAndLoadToken(oAuth2Client) {
  if (fs.existsSync(tokenPath)) {
    const token = JSON.parse(fs.readFileSync(tokenPath));
    oAuth2Client.setCredentials(token);
    console.log('Token chargé avec succès depuis', tokenPath);
  } else {
    console.log('Aucun token trouvé, démarrage du processus d’autorisation...');
    getAccessToken(oAuth2Client);
  }
}

const oAuth2Client = getOAuth2Client();
checkAndLoadToken(oAuth2Client);

module.exports = {
  getAccessToken: getAccessToken,
  checkAndLoadToken: checkAndLoadToken,
  getOAuth2Client: getOAuth2Client
}