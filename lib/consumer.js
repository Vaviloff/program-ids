const Bull = require('bull');
const fs = require('fs');
const { spawn } = require('child_process');

function download(folder, pid, proxy) {
  return new Promise((resolve) => {
    const args = [`--output "${folder}"`, `--pid ${pid}`];

    if (proxy !== null) {
      args.push(`--proxy=${proxy}`);
    }

    const getIplayer = spawn('get_iplayer', args, { shell: true });

    getIplayer.stdout.pipe(process.stdout);

    getIplayer.stderr.on('data', (data) => {
      console.log(`ERROR: ${data}`);
    });

    getIplayer.on('close', () => {
      console.log('get_iplayer CLOSED');
      resolve();
    });
  });
}

const run = (options) => {
  const Q = new Bull('download-queue', options.redis);

  Q.process(async (job, done) => {
    console.log(JSON.stringify(job.data, null, 2));
    const { title, pid } = job.data;
    const folder = title.replace(/[^a-z0-9.,! ]/ig, '');
    const path = `downloads/${folder}`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    // console.log(`${folder}: ${url}`);

    await download(path, pid, options.proxy).then(() => done());
  });
};

module.exports = { run };
