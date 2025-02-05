require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors'); 

const { getRepoList } = require('./utils/githubAuth');

const app = express();
const PORT = process.env.PORT || 5000;

// Configura CORS per consentire richieste dal frontend React
app.use(cors({
  origin: process.env.FRONTEND_URL, // Specifica il dominio che può accedere
  methods: ['GET', 'POST'], // Specifica i metodi HTTP consentiti
}));

// Leggi la tua chiave privata
const privateKey = fs.readFileSync('./repo-reader-key.pem', 'utf8'); // Inserisci qui il percorso della tua chiave privata
const APP_ID = '1085802'; // Sostituisci con il tuo App ID GitHub

app.get('/generate-jwt', (req, res) => {
  const payload = {
    iat: Math.floor(Date.now() / 1000), // Timestamp attuale
    exp: Math.floor(Date.now() / 1000) + (10 * 60), // Scadenza: 10 minuti
    iss: APP_ID,
  };

  try {
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    res.json({ token });
  } catch (error) {
    console.error('Errore nella generazione del JWT:', error);
    res.status(500).json({ error: 'Errore nella generazione del token' });
  }
});

// Endpoint per ottenere la lista dei repository

app.get('/repositories', async (req, res) => {
  const jwtToken = req.headers.authorization; // Ottieni il JWT passato dal frontend
  if (!jwtToken) {
    return res.status(401).json({ error: 'Token mancante' });
  }
  try {
    const repositories = await getRepoList(jwtToken);
    res.json({ repositories: repositories });
  } catch (error) {
    console.error('Errore durante la chiamata alle API di GitHub:', error);
    res.status(500).json({ error: 'Errore nel recupero dei repository' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
