const Bull = require('bull');
const fs = require('fs');
const { spawn } = require('child_process');

function download(folder, pid, proxy) {
  return new Promise((resolve, reject) => {
    const getIplayer = spawn('get_iplayer', [`--output "${folder}"`, `--pid ${pid}`, `--proxy=${proxy}`]);

    getIplayer.stderr.on('data', (data) => {
      console.log(`${data}`);
    });

    getIplayer.on('close', (code) => {
      resolve();
    });
  });
}

const run = () => {
  const Q = new Bull('download-queue');

  Q.process(async (job, done) => {

    const { url, title } = job.data;
    // console.log(JSON.stringify(job.data, null, 2));
    const folder = title.replace(/[^a-z0-9.,! ]/ig, '');

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    console.log(`${folder}: ${url}`);

    await download(folder, pid, proxy).then(() => done());

  });
};

module.exports = { run };
