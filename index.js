const puppeteer = require('puppeteer');

const getIds = async (url) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const ids = await page.evaluate(() => [...document.querySelectorAll('.programme__titles a')].map((a) => a.href.split('/').pop()));

  await browser.close();
  return ids;
};

module.exports = getIds;
