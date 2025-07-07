const fs = require("fs");
const path = require("path");

const basePath = path.join(__dirname, "assets", "songs");

// Read all album folders inside /assets/songs
fs.readdirSync(basePath).forEach(folder => {
    const folderPath = path.join(basePath, folder);
    const isDirectory = fs.statSync(folderPath).isDirectory();

    if (isDirectory) {
        const songs = fs.readdirSync(folderPath)
            .filter(file => file.endsWith(".mp3"))
            .sort(); // optional: sort alphabetically

        const jsonPath = path.join(folderPath, "songs.json");
        fs.writeFileSync(jsonPath, JSON.stringify(songs, null, 2), "utf8");

        console.log(`✅ songs.json created for ${folder}`);
    }
});
