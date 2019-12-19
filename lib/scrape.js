const process = async (page, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  return page.evaluate(() => {
    // Get links of the programs
    const links = [...document.querySelectorAll('.programme__titles a')];
    const programIds = links.map((link) => link.href.split('/').pop());

    // Get nextUrl
    const nextUrl = document.querySelector('.pagination__next a') === null ? false : document.querySelector('.pagination__next a').href;

    return { ids: programIds, next: nextUrl };
  });
};

const scrape = async (page, url) => {

  const { ids, next } = await process(page, url);

  // @TODO: Send urls to queue
  console.log(ids);

  if (next) {
    await page.waitFor(1000 + Math.random() * 2000);
    return scrape(page, next);
  }

  return true;
};

module.exports = { scrape, process };
