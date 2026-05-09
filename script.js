// ===== SONGS DATA =====
const songs = [
    {
        songName: 'Ishq Mein',
        artist: 'Atif Aslam',
        album: 'Ishq Mein',
        coverPath: 'covers/ishq-Mein.jpg',
        filepath: 'song/ishq-Mein.mp3',
        duration: '5:34'
    },
    {
        songName: 'Sanam Teri Kasam',
        artist: 'Ankit Tiwari',
        album: 'Sanam Teri Kasam',
        coverPath: 'covers/sanam-Teri-Kasam.jpg',
        filepath: 'song/sanam-Teri-Kasam.mp3',
        duration: '4:50'
    },
    {
        songName: 'Khamoshiyan',
        artist: 'Arijit Singh',
        album: 'Khamoshiyan',
        coverPath: 'covers/khamishiya.jpeg',
        filepath: 'song/khamoshiyan.mp3',
        duration: '5:15'
    },
    {
        songName: 'Bekhayali',
        artist: 'Sachet Tandon',
        album: 'Kabir Singh',
        coverPath: 'covers/bekhyali.jpg',
        filepath: 'song/bekhayali.mp3',
        duration: '5:41'
    },
    {
        songName: 'Shoorveer',
        artist: 'Various Artists',
        album: 'Shoorveer',
        coverPath: 'covers/shoorveer.jpg',
        filepath: 'song/shoorveer.mp3',
        duration: '6:12'
    },
    {
        songName: 'Mareez-E-Ishq',
        artist: 'Altamash Faridi',
        album: 'Zid',
        coverPath: 'covers/mareez-e-ishq.jpg',
        filepath: 'song/mareez-e-ishq.mp3',
        duration: '4:30'
    },
];

// ===== STATE =====
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0=off, 1=all, 2=one
let isLiked = false;

const audioElement = new Audio(songs[0].filepath);
audioElement.volume = 0.8;

// ===== DOM ELEMENTS =====
const masterPlay     = document.getElementById('masterPlay');
const myProgressBar  = document.getElementById('myProgressBar');
const playingGif     = document.getElementById('playingGif');
const nowPlayingCover= document.getElementById('nowPlayingCover');
const nowPlayingTitle= document.getElementById('nowPlayingTitle');
const currentTimeEl  = document.getElementById('currentTime');
const totalDurationEl= document.getElementById('totalDuration');
const volumeBar      = document.getElementById('volumeBar');
const volumeBtn      = document.getElementById('volumeBtn');
const shuffleBtn     = document.getElementById('shuffleBtn');
const repeatBtn      = document.getElementById('repeatBtn');
const prevBtn        = document.getElementById('prevBtn');
const nextBtn        = document.getElementById('nextBtn');
const likeBtn        = document.getElementById('likeBtn');
const bigPlayBtn     = document.getElementById('bigPlayBtn');
const heroImg        = document.getElementById('heroImg');
const songsList      = document.getElementById('songsList');

// ===== BUILD SONG LIST =====
function buildSongList() {
    songsList.innerHTML = '';
    songs.forEach((song, index) => {
        const row = document.createElement('div');
        row.className = 'song-row' + (index === currentSongIndex ? ' active' : '');
        row.id = `song-row-${index}`;
        row.innerHTML = `
            <div class="col-num">
                <span class="row-num">${index + 1}</span>
                <span class="row-play"><i class="fas ${index === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i></span>
            </div>
            <div class="song-row-title">
                <img src="${song.coverPath}" alt="${song.songName}">
                <div>
                    <div class="song-row-name">${song.songName}</div>
                    <div class="song-row-artist">${song.artist}</div>
                </div>
            </div>
            <div class="col-album">${song.album}</div>
            <div class="col-duration">${song.duration}</div>
        `;
        row.addEventListener('click', () => playSong(index));
        songsList.appendChild(row);
    });
}

// ===== PLAY SONG =====
function playSong(index) {
    currentSongIndex = index;
    const song = songs[index];

    audioElement.src = song.filepath;
    audioElement.currentTime = 0;
    audioElement.play();
    isPlaying = true;

    updatePlayerUI();
    updateProgressFill();
    buildSongList();
}

function updatePlayerUI() {
    const song = songs[currentSongIndex];

    // Player bar
    nowPlayingCover.src = song.coverPath;
    nowPlayingTitle.textContent = song.songName;

    // Hero
    heroImg.src = song.coverPath;

    // Play/Pause icons
    masterPlay.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';
    bigPlayBtn.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';

    // GIF
    playingGif.style.opacity = isPlaying ? '1' : '0';

    // Active row icon
    document.querySelectorAll('.song-row').forEach((row, i) => {
        const playIcon = row.querySelector('.row-play i');
        if (i === currentSongIndex && playIcon) {
            playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    });
}

// ===== PLAY / PAUSE TOGGLE =====
function togglePlayPause() {
    if (audioElement.paused) {
        audioElement.play();
        isPlaying = true;
    } else {
        audioElement.pause();
        isPlaying = false;
    }
    updatePlayerUI();
}

masterPlay.addEventListener('click', togglePlayPause);
bigPlayBtn.addEventListener('click', () => {
    if (!isPlaying && audioElement.currentTime === 0) {
        playSong(currentSongIndex);
    } else {
        togglePlayPause();
    }
});

// ===== PREV / NEXT =====
function playNext() {
    if (isShuffle) {
        let rand;
        do { rand = Math.floor(Math.random() * songs.length); }
        while (rand === currentSongIndex && songs.length > 1);
        playSong(rand);
    } else {
        playSong((currentSongIndex + 1) % songs.length);
    }
}

function playPrev() {
    if (audioElement.currentTime > 3) {
        audioElement.currentTime = 0;
        return;
    }
    playSong((currentSongIndex - 1 + songs.length) % songs.length);
}

nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

// ===== SONG ENDED =====
audioElement.addEventListener('ended', () => {
    if (repeatMode === 2) {
        audioElement.currentTime = 0;
        audioElement.play();
    } else if (repeatMode === 1) {
        playNext();
    } else if (currentSongIndex < songs.length - 1) {
        playNext();
    } else {
        isPlaying = false;
        updatePlayerUI();
    }
});

// ===== PROGRESS BAR =====
audioElement.addEventListener('timeupdate', () => {
    if (!audioElement.duration) return;
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    myProgressBar.value = progress;
    myProgressBar.style.setProperty('--progress', progress + '%');
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
    updateProgressFill();
});

audioElement.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audioElement.duration);
});

myProgressBar.addEventListener('input', () => {
    const val = myProgressBar.value;
    myProgressBar.style.setProperty('--progress', val + '%');
    audioElement.currentTime = (val / 100) * audioElement.duration;
});

function updateProgressFill() {
    const val = myProgressBar.value;
    myProgressBar.style.setProperty('--progress', val + '%');
}

// ===== VOLUME =====
volumeBar.style.setProperty('--progress', '80%');
volumeBar.addEventListener('input', () => {
    const vol = volumeBar.value / 100;
    audioElement.volume = vol;
    volumeBar.style.setProperty('--progress', volumeBar.value + '%');
    if (vol === 0) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (vol < 0.5) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

let prevVolume = 0.8;
volumeBtn.addEventListener('click', () => {
    if (audioElement.volume > 0) {
        prevVolume = audioElement.volume;
        audioElement.volume = 0;
        volumeBar.value = 0;
        volumeBar.style.setProperty('--progress', '0%');
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        audioElement.volume = prevVolume;
        volumeBar.value = prevVolume * 100;
        volumeBar.style.setProperty('--progress', (prevVolume * 100) + '%');
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

// ===== SHUFFLE =====
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

// ===== REPEAT =====
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    if (repeatMode === 0) {
        repeatBtn.classList.remove('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        repeatBtn.title = 'Repeat Off';
    } else if (repeatMode === 1) {
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        repeatBtn.title = 'Repeat All';
    } else {
        repeatBtn.classList.add('active');
        repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
        repeatBtn.title = 'Repeat One';
    }
});

// ===== LIKE =====
likeBtn.addEventListener('click', () => {
    isLiked = !isLiked;
    likeBtn.classList.toggle('liked', isLiked);
    likeBtn.innerHTML = isLiked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
});

// ===== HELPERS =====
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); togglePlayPause(); }
    if (e.code === 'ArrowRight') { audioElement.currentTime = Math.min(audioElement.currentTime + 10, audioElement.duration); }
    if (e.code === 'ArrowLeft') { audioElement.currentTime = Math.max(audioElement.currentTime - 10, 0); }
    if (e.code === 'ArrowUp') { audioElement.volume = Math.min(audioElement.volume + 0.1, 1); volumeBar.value = audioElement.volume * 100; }
    if (e.code === 'ArrowDown') { audioElement.volume = Math.max(audioElement.volume - 0.1, 0); volumeBar.value = audioElement.volume * 100; }
    if (e.code === 'KeyN') playNext();
    if (e.code === 'KeyP') playPrev();
});

// ===== INIT =====
buildSongList();
