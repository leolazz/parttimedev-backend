import * as puppeteer from 'puppeteer';

export function scrape() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(
        'https://www.indeed.com/jobs?q=software%20developer&l=Washington%20State&jt=parttime',
      );

      let urls = await page.evaluate(() => {
        let results = [];
        let container = document.querySelector('#resultsCol');
        let matches = container.querySelectorAll('h2.jobTitle > span');
        matches.forEach((item) => {
          results.push({
            text: item.innerHTML.trim(),
          });
        });
        return results;
      });
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  });
}
scrape().then(console.log).catch(console.error);
