const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

const playlistPath = './playlist.json';
const musicsDir = './assets/musics';

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
    .replace(/[^a-z0-9]/gi, '') // retire tout sauf lettres et chiffres
    .replace(/feat|ft/g, '') // retire feat/ft
    .replace(/\s+/g, '');
}

const files = fs.readdirSync(musicsDir).filter(f => f.endsWith('.mp3'));
const filesNorm = files.map(f => ({
  file: f,
  norm: normalize(f.replace('[SPOTDOWNLOADER.COM]', '').replace('.mp3', ''))
}));

let playlist = JSON.parse(fs.readFileSync(playlistPath, 'utf8'));

for (let i = 0; i < playlist.length; i++) {
  const titleNorm = normalize(playlist[i].title);
  // Fuzzy matching sur tous les fichiers
  const matches = filesNorm.map(f => ({
    ...f,
    score: stringSimilarity.compareTwoStrings(titleNorm, f.norm)
  }));
  matches.sort((a, b) => b.score - a.score);
  let found = matches[0] && matches[0].score > 0.5 ? matches[0] : null;
  if (!found) {
    // Essaye aussi avec l'artiste
    const artistNorm = normalize(playlist[i].artist.split(',')[0]);
    const matchesArtist = filesNorm.map(f => ({
      ...f,
      score: stringSimilarity.compareTwoStrings(artistNorm, f.norm)
    }));
    matchesArtist.sort((a, b) => b.score - a.score);
    found = matchesArtist[0] && matchesArtist[0].score > 0.5 ? matchesArtist[0] : null;
  }
  if (found) {
    playlist[i].mp3Url = path.join('assets/musics', found.file);
    console.log(`Match: ${playlist[i].title} => ${found.file} (score: ${found.score.toFixed(2)})`);
  } else {
    playlist[i].mp3Url = '';
    console.log(`Aucun mp3 trouvé pour: ${playlist[i].title}`);
  }
}

fs.writeFileSync(playlistPath, JSON.stringify(playlist, null, 2), 'utf8');
console.log('Mise à jour des mp3Url terminée !'); 