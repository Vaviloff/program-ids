const puppeteer = require('puppeteer');

const UserAgent = require('user-agents');

let browser;

async function createPage() {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-sandbox'],
  });

  const page = await browser.newPage();
  const userAgent = new UserAgent();
  await page.setUserAgent(userAgent.toString());

  return page;
}

async function close() {
  await browser.close();
}

module.exports = { createPage, close };
