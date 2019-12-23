const puppeteer = require('puppeteer');

const UserAgent = require('user-agents');

let browser;

async function createPage() {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const userAgent = new UserAgent();
  console.log(userAgent.toString());
  await page.setUserAgent(userAgent.toString());

  return page;
}

async function close() {
  await browser.close();
}

module.exports = { createPage, close };
