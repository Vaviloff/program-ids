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
  argv.proxy = null;
}

(async () => {
  let pageUrl = argv.url;
  const { proxy, redis } = argv;
  const redisHost = redis || process.env.REDIS_HOST || 'redis://127.0.0.1:6379';

  consumer.run({ proxy, redis: redisHost });

  if (!pageUrl.includes('/episodes/player')) {
    pageUrl += '/episodes/player';
  }

  const page = await browser.createPage();
  const scraper = new Scraper(page, { proxy, redis: redisHost });
  await scraper.scrape(pageUrl);

  await browser.close();
})();
