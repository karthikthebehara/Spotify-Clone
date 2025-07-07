const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const basePath = path.join(__dirname, "assets", "songs");

fs.readdirSync(basePath).forEach(album => {
    const albumPath = path.join(basePath, album);
    if (fs.statSync(albumPath).isDirectory()) {
        fs.readdirSync(albumPath).forEach(file => {
            if (file.endsWith(".mp3")) {
                const original = path.join(albumPath, file);
                const compressed = path.join(albumPath, "compressed-" + file);

                try {
                    execSync(`ffmpeg -y -i "${original}" -b:a 128k "${compressed}"`);
                    fs.renameSync(compressed, original); // replace original
                    console.log(`✅ Compressed ${file} in ${album}`);
                } catch (err) {
                    console.error(`❌ Error compressing ${file}:`, err.message);
                }
            }
        });
    }
});
