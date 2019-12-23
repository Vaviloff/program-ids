class Scraper {
  constructor(page) {
    this.page = page;
  }

  async process(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });

    return this.page.evaluate(() => {
      // Get links of the programs
      const links = [...document.querySelectorAll('.programme__titles a')];
      const programIds = links.map((link) => link.href.split('/').pop());

      // Get nextUrl
      const nextUrl = document.querySelector('.pagination__next a') === null ? false : document.querySelector('.pagination__next a').href;

      return { ids: programIds, next: nextUrl };
    });
  }

  async scrape(url) {

    const { ids, next } = await this.process(url);

    // @TODO: Send urls to queue
    console.log(ids);

    if (next) {
      await this.page.waitFor(1000 + Math.random() * 2000);
      return this.scrape(next);
    }

    return true;
  }
}

module.exports = Scraper;
