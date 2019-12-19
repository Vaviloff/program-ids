const puppeteer = require('puppeteer');
const { scrape } = require('./lib/scrape.js');

const argv = require('yargs') // eslint-disable-line
  .option('url', {
    alias: 'u',
    description: 'URL of the program to donwload',
    type: 'string',
  })
  .option('proxy', {
    alias: 'p',
    description: 'Proxy to use with the program',
    type: 'string',
  })
  .help()
  .alias('help', 'h').argv;

if (!argv.url) {
  throw Error('URL of the program cannot be empty');
}

if (!argv.proxy) {
  throw Error('Proxy is necessary');
}

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let pageUrl = argv.url;

  if (!pageUrl.includes('/episodes/player')) {
    pageUrl += '/episodes/player';
  }

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36');

  await scrape(page, pageUrl);

  await browser.close();
})();
