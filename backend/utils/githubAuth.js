const axios = require('axios');

// Funzione per ottenere la lista delle installazioni
const getInstallations = async (jwt) => {
  try {
    const response = await axios.get(`${process.env.GITHUB_API_URL}/app/installations`, {
      headers: {
        Authorization: `Bearer ${jwt}`, // Usa il JWT per autenticare la richiesta
        Accept: 'application/vnd.github+json',
      },
    });

    // Restituisci la lista delle installazioni
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero delle installazioni:', error.response?.data || error.message);
    throw new Error('Errore nel recupero delle installazioni');
  }
};

// Funzione per ottenere l'ID dell'installazione
const getInstallationId = async (jwt) => {
  try {
    const installations = await getInstallations(jwt);
    
    // Se ci sono installazioni, restituisci l'ID della prima installazione
    if (installations.length > 0) {
      return installations[0].id; // Restituisce l'ID della prima installazione
    } else {
      throw new Error('Nessuna installazione trovata');
    }
  } catch (error) {
    console.error('Errore nel recupero dell\'installation ID:', error);
    throw new Error('Errore nel recupero dell\'installation ID');
  }
};

// Funzione per ottenere il token di accesso per l'installazione
const getInstallationAccessToken = async (jwt, installationId) => {
  try {
    const response = await axios.post(
      `${process.env.GITHUB_API_URL}/app/installations/${installationId}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`, // Usa il JWT per autenticare la richiesta
          Accept: 'application/vnd.github+json',
        },
      }
    );

    return response.data.token;
  } catch (error) {
    console.error('Errore nell\'ottenere il token di accesso per l\'installazione:', error.response?.data || error.message);
    throw new Error('Errore nel recupero del token di accesso per l\'installazione');
  }
};

const getRepositories = async (installationAccessToken) => {
  console.log(">>", installationAccessToken)
  try {
    const response = await axios.get(`${process.env.GITHUB_API_URL}/installation/repositories`, {
      headers: {
        Authorization: `Bearer ${installationAccessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    // Restituisci la lista dei repository
    return response.data.repositories;
  } catch (error) {
    console.error('Errore nel recupero dei repository:', error.response?.data || error.message);
    throw new Error('Errore nel recupero dei repository');
  }
};

const getFileContent = async (repoOwner, repoName, filePath, token) => {
  try {
    const response = await axios.get(
      `${process.env.GITHUB_API_URL}/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3.raw', // Indica che vuoi il contenuto raw del file
        }
      }
    );
    return response.data; // Restituirà il contenuto del file
  } catch (error) {
    console.error("Errore nel recupero del file:", error);
    //throw error;
    return {}
  }
};

const getRepoList = async (jwt) => {
  try {
    console.log('repoList')
    const contents = [];
    // Ottieni l'ID dell'installazione usando il JWT
    const installationId = await getInstallationId(jwt);
    // Ottieni il token di accesso per l'installazione
    const installationAccessToken = await getInstallationAccessToken(jwt, installationId);
    // Ottieni la lista dei repository
    const repositories = await getRepositories(installationAccessToken);
    for (let repo of repositories){
      const {id, name, created_at, has_pages, html_url} = repo;
      const repo_info = await getFileContent('lordag', name, 'info.json', installationAccessToken);
      console.log(repo_info)
      if(repo_info.preview){        
        contents.push({id, name,created_at,has_pages,html_url, ...repo_info})
      }
      
    }
    return contents;
  } catch (error) {
    //console.error('Errore nel recupero dei repository:', error);
    throw new Error('Errore nel recupero dei repository');
  }
};

module.exports = { getRepoList };