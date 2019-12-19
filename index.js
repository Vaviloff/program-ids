const puppeteer = require('puppeteer');

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

const scrape = async (page, url) => {
  let pageUrl = url;

  if (!url.includes('/episodes/player')) {
    pageUrl += '/episodes/player';
  }

  await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

  const { ids, next } = await page.evaluate(() => {
    // Get links of the programs
    const links = [...document.querySelectorAll('.programme__titles a')];
    const programIds = links.map((link) => link.href.split('/').pop());

    // Get nextUrl
    const nextUrl = document.querySelector('.pagination__next a') === null ? false : document.querySelector('.pagination__next a').href;

    return { ids: programIds, next: nextUrl };
  });

  // @TODO: Send urls to queue
  console.log(ids);

  if (next) {
    await page.waitFor(1000 + Math.random() * 2000);
    return scrape(page, next);
  }

  return true;
};

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36');

  await scrape(page, argv.url);

  await browser.close();
})();
