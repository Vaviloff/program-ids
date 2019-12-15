const puppeteer = require('puppeteer');

const getIds = async (url) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const ids = await page.evaluate(() => {
    const links = [...document.querySelectorAll('.programme__titles a')];
    const ids = links.map((link) => link.href.split('/').pop());
    return ids;
  });

  await browser.close();
  return ids;
};

module.exports = getIds;
