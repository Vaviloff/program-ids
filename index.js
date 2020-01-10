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

const Scraper = require('./lib/scrape.js');

const browser = require('./lib/browser.js');

const consumer = require('./lib/consumer.js');

if (!argv.url) {
  throw Error('URL of the program cannot be empty');
}

if (!argv.proxy) {
  throw Error('Proxy is necessary');
}

(async () => {
  let pageUrl = argv.url;
  const { proxy } = argv;

  consumer.run({ proxy });

  if (!pageUrl.includes('/episodes/player')) {
    pageUrl += '/episodes/player';
  }

  const page = await browser.createPage();

  const scraper = new Scraper(page, { proxy });
  await scraper.scrape(pageUrl);

  await browser.close();
})();
