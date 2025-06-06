const fs = require('fs');
const path = require('path');
const csvFilePath = path.join(__dirname, 'playlist_kermesse_cole.csv');
const outputJsonPath = path.join(__dirname, 'playlist.json');

const csv = require('csv-parser');

const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => {
    results.push({
      title: data['Track Name'],
      artist: data['Artist Name(s)'],
      album: data['Album Name'],
      releaseDate: data['Release Date'],
      durationMs: data['Duration (ms)'],
      imageUrl: '', // à compléter si tu as des images
      mp3Url: '',   // à compléter avec le lien Google Drive
      spotifyUri: data['Track URI'],
    });
  })
  .on('end', () => {
    fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2), 'utf8');
    console.log('Conversion terminée. Fichier playlist.json généré.');
  }); 