document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const playPauseButton = document.getElementById('play-pause');
    const currentTimeElem = document.getElementById('current-time');
    const totalTimeElem = document.getElementById('total-time');
    const progressBar = document.querySelector('.progress');
    const playlist = document.querySelector('.playlist');
    const toggleButton = document.getElementById('toggle-playlist');
    const playlistItems = document.querySelectorAll('.playlist li');
    let currentVideoIndex = 0;

    // Load saved video time
    const savedTime = localStorage.getItem('video-time');
    if (savedTime) {
        video.currentTime = savedTime;
    }

    // Update the play/pause button
    function updatePlayPauseButton() {
        playPauseButton.textContent = video.paused ? 'Play' : 'Pause';
    }

    // Play/pause video
    playPauseButton.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Update current time and progress bar
    video.addEventListener('timeupdate', () => {
        const currentTime = video.currentTime;
        const duration = video.duration;
        const progressPercent = (currentTime / duration) * 100;

        currentTimeElem.textContent = formatTime(currentTime);
        totalTimeElem.textContent = formatTime(duration);
        progressBar.style.width = `${progressPercent}%`;

        localStorage.setItem('video-time', currentTime);
    });

    // Format time in mm:ss
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Prevent seeking
    video.addEventListener('seeking', (e) => {
        if (video.currentTime > video.played.end(0)) {
            video.currentTime = video.played.end(0);
        }
    });

    // Playlist functionality
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index === currentVideoIndex) {
                loadVideo(item, index);
            }
        });
    });

    video.addEventListener('ended', () => {
        playlistItems[currentVideoIndex].classList.add('completed');
        currentVideoIndex++;
        if (currentVideoIndex < playlistItems.length) {
            playlistItems[currentVideoIndex].classList.remove('locked');
            playlistItems[currentVideoIndex].classList.add('active');
        }
    });

    toggleButton.addEventListener('click', () => {
        playlist.classList.toggle('hidden');
        toggleButton.textContent = playlist.classList.contains('hidden') ? 'Show Playlist' : 'Hide Playlist';
    });

    function loadVideo(item, index) {
        playlistItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        video.src = item.getAttribute('data-video');
        video.play();
        currentVideoIndex = index;
    }

    // Initial load
    loadVideo(playlistItems[currentVideoIndex], currentVideoIndex);
    updatePlayPauseButton();

    // Update play/pause button on video play/pause events
    video.addEventListener('play', updatePlayPauseButton);
    video.addEventListener('pause', updatePlayPauseButton);
});
