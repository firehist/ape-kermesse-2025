let playlist = [];
let currentTrack = 0;

// Chargement de la playlist
fetch('playlist.json')
  .then(res => res.json())
  .then(data => {
    playlist = data;
    console.log(playlist);
    renderPlaylist();
    loadTrack(0);
  });

function renderPlaylist() {
  const playlistEl = document.getElementById('playlist');
  playlistEl.innerHTML = '';
  playlist.forEach((track, idx) => {
    const li = document.createElement('li');
    li.textContent = `${track.title} - ${track.artist}`;
    li.onclick = () => playTrack(idx);
    if (idx === currentTrack) li.classList.add('active');
    playlistEl.appendChild(li);
  });
}

function loadTrack(idx) {
  const track = playlist[idx];
  document.getElementById('track-title').textContent = track.title;
  document.getElementById('track-artist').textContent = track.artist;
  document.getElementById('track-album').textContent = track.album;
  document.getElementById('cover').src = track.imageUrl || 'https://via.placeholder.com/200x200?text=Kermesse';
  const audio = document.getElementById('audio');
  audio.src = track.mp3Url || '';
  highlightCurrentTrack();
}

function playTrack(idx) {
  currentTrack = idx;
  loadTrack(idx);
  document.getElementById('audio').play();
}

function highlightCurrentTrack() {
  const items = document.querySelectorAll('#playlist li');
  items.forEach((li, idx) => {
    li.classList.toggle('active', idx === currentTrack);
  });
}

document.getElementById('prev').onclick = () => {
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  playTrack(currentTrack);
};
document.getElementById('next').onclick = () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  playTrack(currentTrack);
};
document.getElementById('play').onclick = () => {
  document.getElementById('audio').play();
};
document.getElementById('pause').onclick = () => {
  document.getElementById('audio').pause();
};

document.getElementById('audio').onended = () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  playTrack(currentTrack);
}; 