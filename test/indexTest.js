const { expect } = require('chai');
const puppeteer = require('puppeteer');
const path = require('path');
const { process } = require('../lib/scrape');

const pagePath = path.join('file:///', __dirname, 'page.html');

const opts = {
  headless: false,
  slowMo: 100,
  timeout: 0,
  args: ['--start-maximized', '--window-size=1366,786'],
};

before(async () => {
  global.expect = expect;
  global.browser = await puppeteer.launch(opts);
});

after(async () => {
  await global.browser.close();
});

describe('it should get IDs', async function testExample() {
  this.timeout(30000);

  let page;

  before(async () => {
    page = await global.browser.newPage();
    await page.setViewport({ width: 1366, height: 786 });
  });

  after(async () => {
    await page.close();
  });

  it('gets the IDs', async () => {
    const { ids, next } = await process(page, pagePath);
    console.log(ids);
    expect(ids).to.include.members(['3', '2', '1']);
    expect(next).to.equal(false);
  });
});
