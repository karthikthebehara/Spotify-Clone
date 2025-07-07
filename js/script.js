
let currentSong;
currentSong = new Audio();
let songs;
let currFolder;


function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    // Pad with leading zeros if needed
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}



async function getSongs(folder) {
    currFolder = folder;

    // ✅ Load songs from songs.json
    let a = await fetch(`/assets/songs/${folder}/songs.json`);
    songs = await a.json();

    // Show all the songs in the playlist
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for (const song of songs) {
        const decoded = decodeURIComponent(song);

        const cleanName = decoded
            .replace(/\[.*?\]/g, '')
            .replace(/^\s*\d+\s*[-.]\s*/, '')
            .replace(/\(.*?\)/g, '')
            .replace(/320kbps/ig, '')
            .replace(/\.mp3$/i, '')
            .replace(/_/g, ' ')
            .trim();

        songUL.innerHTML += `<li>  
            <img class="music-icon" src="assets/images/music.svg" alt="">
            <div class="info">
                <div data-file="${song}">${cleanName}</div>
                <div>Karthik</div>
            </div>
            <div class="play-now">
                <span>Play now</span>
                <img src="assets/images/play copy.svg" alt="">
            </div>
        </li>`;
    }

    // play the song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            const actualFile = e.querySelector(".info div").dataset.file;
            playMusic(actualFile);
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/assets/songs/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "assets/images/pause.svg";
    }
    play.src = "assets/images/pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";




};

async function displayAlbums() {
    console.log("Displaying albums");

    let a = await fetch("assets/songs/albums.json");
    let albums = await a.json(); // ⬅️ Now we're reading all album data from one file
    let cardContainer = document.querySelector(".card-container");
    cardContainer.innerHTML = "";

    for (const album of albums) {
        cardContainer.innerHTML += `
            <div data-folder="${album.folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="assets/songs/${album.folder}/${album.image}" alt="${album.title}">
                <h2>${album.title}</h2>
                <p>${album.description}</p>
            </div>`;
    }

    // Load the playlist whenever a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs");
            songs = await getSongs(e.dataset.folder);
            playMusic(songs[0]);
        });
    });
}



async function main() {
    await getSongs("Aanand");
    playMusic(songs[0], true);

    //diaply all the albums on the page
    displayAlbums();


    //attach an event listner to play previous and nexxt song
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets/images/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "assets/images/play.svg"
        }
    })


    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    //add even listner for seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //add an event listner to hamburger and user
    const hamburger = document.querySelector(".hamburger");
    const leftNav = document.querySelector(".left");

    hamburger.addEventListener("click", () => {
        leftNav.classList.toggle("show");

        if (leftNav.classList.contains("show")) {
            hamburger.src = "assets/images/close.svg";  // cross icon
        } else {
            hamburger.src = "assets/images/hamburger.svg";  // original hamburger icon
        }
    });
    const user = document.querySelector(".user");
    const rightnav = document.querySelector(".right-nav");

    user.addEventListener("click", () => {
        rightnav.classList.toggle("show");

        if (rightnav.classList.contains("show")) {
            user.src = "assets/images/close.svg";  // cross icon
        } else {
            user.src = "assets/images/hamburger.svg";  // original hamburger icon
        }
    });

    // add even listner for previous and next
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    //add an event listner for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e)
        currentSong.volume = parseInt(e.target.value) / 100
    })


    // add event listner to mute

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("assets/images/volume.svg")) {
            e.target.src = e.target.src.replace("assets/images/volume.svg", "assets/images/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("assets/images/mute.svg", "assets/images/volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0] = 10;
        }
    })




}
main();