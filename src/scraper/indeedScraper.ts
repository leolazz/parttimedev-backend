import { query } from 'express';
import * as puppeteer from 'puppeteer';

export function scrape() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(
        'https://www.indeed.com/jobs?q=software%20developer&l=Washington%20State&jt=parttime',
      );

      //       let urls = await page.evaluate(() => {
      //         let results = [];
      //         let matches = document.querySelectorAll('td#resultsCol');
      //         matches.forEach((item) => {
      //           results.push({
      //             title: document.querySelector('h2.jobTitle > span').textContent,
      //             companyName: document.querySelector('span.companyName').textContent,
      //             companyLocation: document.querySelector('div.companyLocation')
      //               .textContent,
      //             jobDescription: document
      //               .querySelector('div.job-snippet')
      //               .textContent.trim()
      //               .replace(/\n|\r/g, ''),
      //             income: document.querySelector('span.salary-snippet').textContent,
      //             link: document.querySelector('a').href,
      //           });
      //         });
      //         return results;
      //       });
      //       browser.close();
      //       console.log(urls.length);
      //       return resolve(urls);
      //     } catch (e) {
      //       return reject(e);
      //     }
      //   });
      // }
      // scrape().then(console.log).catch(console.error);

      //             companyLocation: document.querySelector('div.companyLocation')
      //               .textContent,
      //             jobDescription: document
      //               .querySelector('div.job-snippet')
      //               .textContent.trim()
      //               .replace(/\n|\r/g, ''),
      //             income: document.querySelector('span.salary-snippet').textContent,
      //             link: document.querySelector('a').href,

      let urls = await page.evaluate(() => {
        const titleNodeList = document.querySelectorAll('h2.jobTitle > span');
        const companyName = document.querySelectorAll('span.companyName');
        const companyLocation = document.querySelectorAll(
          'div.companyLocation',
        );
        const jobDescription = document.querySelectorAll('div.job-snippet');
        const income = document.querySelectorAll('span.salary-snippet');
        //const link = document.querySelectorAll('a');
        var jobArray = [];
        for (var i = 0; i < titleNodeList.length; i++) {
          jobArray[i] = {
            title: titleNodeList[i].textContent.trim(),
            companyName: companyName[i].textContent.trim(),
            companyLocation: companyLocation[i].textContent.trim(),
            jobDescription: jobDescription[i].textContent.trim(),
            //income: income[i].textContent.trim()
          };
        }
        return jobArray;
      });
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  });
}
scrape().then(console.log).catch(console.error);
