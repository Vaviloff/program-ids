const Bull = require('bull');

class Scraper {
  constructor(page, options) {
    this.proxy = options.proxy;
    this.page = page;
    this.Q = new Bull('download-queue', {
      limiter: {
        max: 1,
        duration: 10000,
      },
    });

    this.Q
      .on('global:completed', (jobId) => {
        console.log(`Job with id ${jobId} has been completed`);
      })
      .on('error', (error) => {
        console.error(`Error in bull queue happend: ${error}`);
      })
      .on('failed', (job, error) => {
        console.error(`Task was failed with reason: ${error}`);
      })
      .on('global:drained', () => {
        console.log('All done');
        process.exit();
      });
  }

  async process(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });

    return this.page.evaluate(() => {
      // Get links of the programs
      const links = [...document.querySelectorAll('.programme__titles a')];
      const programIds = links.map((link) => link.href.split('/').pop());

      // Get program title
      const title = document.querySelector('.br-masthead__title').innerText;

      // Get nextUrl
      const nextUrl = document.querySelector('.pagination__next a') === null ? false : document.querySelector('.pagination__next a').href;

      return { ids: programIds, title, next: nextUrl };
    });
  }

  async scrape(url) {
    const { ids, next, title } = await this.process(url);

    // Send urls to queue
    let count = 0;
    ids.map(async (id) => {
      count += 1;

      return this.Q.add({
        pid: id,
        title,
        proxy: this.proxy,
        counter: count,
      });
    });

    console.log(ids);

    if (next) {
      await this.page.waitFor(1000 + Math.random() * 2000);
      return this.scrape(next);
    }

    return true;
  }
}

module.exports = Scraper;
