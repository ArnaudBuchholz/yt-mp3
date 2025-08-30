// const yargs = require('yargs');
const fs = require('fs');
const csv = require('csv-parser');
const { exec } = require('child_process');
const NodeID3 = require('node-id3');
const ProgressBar = require('progress');

// THIS PART DID NOT WORK
// const argv = yargs
//   .option('path', {
//     alias: 'p',
//     description: 'Path to the CSV file',
//     type: 'string',
//     demandOption: true,
//   })
//   .help()
//   .alias('help', 'h').argv;

const [,,csvPath] = process.argv; // argv.path;

if (!fs.existsSync(csvPath) || !csvPath.endsWith('.csv')) {
  console.error('Error: The specified file does not exist or is not a CSV file.');
  process.exit(1);
}

const results = [];
fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    const bar = new ProgressBar('  downloading [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: results.length,
    });

    for (const row of results) {
      const { ARTIST, TITLE, URL } = row;
      const fileName = `${ARTIST} - ${TITLE}.mp3`;

      // ADDENDUM: because yt-dlp randomly fails, adds this to skip already downloaded mp3s
      if (fs.existsSync(fileName)) {
        bar.tick();
        continue;
      }

      const downloadCommand = `yt-dlp -x --audio-format mp3 "${URL}" -o "${fileName}"`;

      // ADDENDUM: created a retry loop
      let attempts = 0;
      while (true) {
        try {
          await new Promise((resolve, reject) => {
            exec(downloadCommand, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error downloading ${URL}: ${error.message}`);
                return reject(error);
              }
              resolve();
            });
          });
          break;
        } catch (e) {
          if (++attempts < 3) {
            console.log(e);
            console.log('Waiting 10s...');
            await new Promise(resolve => setTimeout(resolve, 10_000));
            console.log('Retrying...');
          } else {
            throw e;
          }
        }
      }

      const tags = {
        title: TITLE,
        artist: ARTIST,
      };

      NodeID3.write(tags, fileName, (err) => {
        if (err) {
          console.error(`Error writing ID3 tags for ${fileName}: ${err.message}`);
        }
      });

      bar.tick();
    }
  });
