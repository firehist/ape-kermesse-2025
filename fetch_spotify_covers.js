const fs = require('fs');
const axios = require('axios');

// À compléter avec tes identifiants Spotify
const client_id = '214e5c6ae9724f82a456ba6bede5d779';
const client_secret = '5e22cb298a8444c6b96b695a3bb25023';

const playlistPath = './playlist.json';

async function getSpotifyToken() {
  const resp = await axios.post('https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      }
    }
  );
  return resp.data.access_token;
}

async function searchSpotifyCover(title, artist, token) {
  const q = encodeURIComponent(`${title} ${artist}`);
  const url = `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`;
  try {
    const resp = await axios.get(url, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const items = resp.data.tracks.items;
    if (items && items.length > 0) {
      // On prend la plus grande image
      return items[0].album.images[0]?.url || '';
    }
  } catch (e) {
    console.error('Erreur Spotify pour', title, artist, e.response?.data || e.message);
  }
  return '';
}

(async () => {
  let playlist = JSON.parse(fs.readFileSync(playlistPath, 'utf8'));
  const token = await getSpotifyToken();
  for (let i = 0; i < playlist.length; i++) {
    if (!playlist[i].imageUrl) {
      const url = await searchSpotifyCover(playlist[i].title, playlist[i].artist, token);
      if (url) {
        playlist[i].imageUrl = url;
        console.log(`Trouvé : ${playlist[i].title} => ${url}`);
      } else {
        console.log(`Aucune image trouvée pour : ${playlist[i].title}`);
      }
      // Petite pause pour éviter le rate limit
      await new Promise(r => setTimeout(r, 300));
    }
  }
  fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2), 'utf8');
  console.log('Mise à jour terminée !');
})(); 