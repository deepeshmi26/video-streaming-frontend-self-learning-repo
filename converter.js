const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure output directory exists
const outputDir = path.join(__dirname, 'converted');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

function convertM3U8ToMP4(inputUrl, outputFileName) {
    return new Promise((resolve, reject) => {
        // Construct output path
        const outputPath = path.join(outputDir, `${outputFileName}.mp4`);
        
        // ffmpeg command to convert m3u8 to mp4
        const ffmpeg = spawn('ffmpeg', [
            '-i', inputUrl,            // Input file
            '-c', 'copy',             // Copy streams without re-encoding
            '-bsf:a', 'aac_adtstoasc', // Fix audio stream
            '-movflags', '+faststart',  // Enable fast start for web playback
            outputPath                  // Output file
        ]);

        // Handle process events
        ffmpeg.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ffmpeg.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                console.log(`Successfully converted to: ${outputPath}`);
                resolve(outputPath);
            } else {
                reject(new Error(`ffmpeg process exited with code ${code}`));
            }
        });

        ffmpeg.on('error', (err) => {
            reject(err);
        });
    });
}

// Example usage
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.log('Usage: node converter.js <m3u8_url> <output_filename>');
        process.exit(1);
    }

    const [inputUrl, outputFileName] = args;
    
    convertM3U8ToMP4(inputUrl, outputFileName)
        .then(outputPath => {
            console.log('Conversion completed:', outputPath);
        })
        .catch(err => {
            console.error('Conversion failed:', err);
            process.exit(1);
        });
}
