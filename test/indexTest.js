const { log } = console;
const { expect } = require('chai');
const puppeteer = require('puppeteer');
const path = require('path');
const Scraper = require('../lib/scrape');

const pagePath = path.join('file:///', __dirname, 'page.html');

const opts = {
  headless: true,
  slowMo: 100,
  timeout: 0,
  args: ['--start-maximized', '--window-size=1366,786', '--no-sandbox'],
};

before(async () => {
  global.expect = expect;
  global.browser = await puppeteer.launch(opts);
});

after(async () => {
  await global.browser.close();
});

describe('it should get IDs', async function testExample() {
  this.timeout(10000);

  let page;
  let scraper;
  const proxy = 'proxy:port';
  const redis = process.env.REDIS_HOST || 'redis://127.0.0.1:6379';

  before(async () => {
    page = await global.browser.newPage();
    scraper = new Scraper(page, { proxy, redis });
    await page.setViewport({ width: 1366, height: 786 });
  });

  after(async () => {
    scraper = null;
    await page.close();
  });

  it('gets the IDs', async () => {
    const { ids, next, title } = await scraper.process(pagePath);
    log(ids);
    expect(ids).to.include.members(['3', '2', '1']);
    expect(next).to.equal(false);
    expect(title).to.equal('Program title');
  });
});
