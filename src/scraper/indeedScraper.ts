import * as puppeteer from 'puppeteer';
import { CreateJobDto } from '../jobs/dto/create-job.dto';
import { Company } from '../jobs/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { JobsService } from '../jobs/jobs.service';

export function scrape() {
  return new Promise<Object[]>(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(
        'https://www.indeed.com/jobs?q=software%20developer&l=Washington%20State&jt=parttime',
        { waitUntil: 'domcontentloaded' },
      );
      await page.waitForSelector('span.salary-snippet');
      let jobs = await page.evaluate(() => {
        const container = document.querySelector('#resultsCol');
        const linksNodeList: NodeListOf<HTMLAnchorElement> =
          container.querySelectorAll('a[id^="job_"], a[id^="sj_"]');
        const title = document.querySelectorAll('h2.jobTitle > span');
        const company = document.querySelectorAll('span.companyName');
        const location = document.querySelectorAll('div.companyLocation');
        const incomeCondition = document.querySelectorAll('td.resultContent');
        const jobDescription = document.querySelectorAll('div.job-snippet');
        const income = document.querySelectorAll('span.salary-snippet');
        let checkedIncome = [];
        let incomeCounter = 0;
        for (let i = 0; i < linksNodeList.length; i++) {
          if (incomeCondition[i].childElementCount === 4) {
            checkedIncome.push(income[incomeCounter].textContent);
            incomeCounter++;
          } else {
            checkedIncome.push('Not Available');
          }
        }
        let jobArray = [];
        for (let i = 0; i < linksNodeList.length; i++) {
          jobArray[i] = {
            title: title[i].textContent.trim(),
            company: company[i].textContent.trim(),
            location: location[i].textContent.trim(),
            description: jobDescription[i].textContent
              .trim()
              .replace(/\n|\r/g, ''),
            income: checkedIncome[i],
            link: linksNodeList[i].href,
          };
        }
        return jobArray;
      });
      browser.close();
      return resolve(jobs);
    } catch (e) {
      return reject(e);
    }
  });
}
