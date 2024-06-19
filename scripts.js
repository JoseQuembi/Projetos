document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const playlist = document.querySelector('.playlist');
    const toggleButton = document.getElementById('toggle-playlist');
    const playlistItems = document.querySelectorAll('.playlist li');
    let currentVideoIndex = 0;

    // Load saved video time
    const savedTime = localStorage.getItem('video-time');
    if (savedTime) {
        video.currentTime = savedTime;
    }

    // Prevent download and fast forward
    video.addEventListener('contextmenu', (e) => e.preventDefault());
    video.addEventListener('seeking', (e) => {
        if (video.currentTime > video.played.end(0)) {
            video.currentTime = video.played.end(0);
        }
    });

    // Allow only pausing the video
    video.addEventListener('pause', () => {
        video.play();
    });

    // Update localStorage with current video time
    video.addEventListener('timeupdate', () => {
        localStorage.setItem('video-time', video.currentTime);
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
});
