import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './entities/job.entity';
import {
  baseFieldSearches,
  BasefieldSearchesArray,
  locationSearchesArray,
  softwareDeveloper,
} from './searchTerms';
import { Browser, Page } from 'puppeteer-extra-plugin/dist/puppeteer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { setTimeout } from 'timers/promises';
import { PuppeteerExtra } from 'puppeteer-extra';
import UserAgent from 'user-agents';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @Inject('PuppeteerStealth')
    private readonly puppeteer: PuppeteerExtra,
  ) {}
  private browser: Browser;
  // @Cron(CronExpression.EVERY_10_MINUTES)
  async cronScrape() {
    this.browser = await this.puppeteer.launch({ headless: false });
    const scrapeAndPurgeNeeded = true;
    // await this.checkLastScrapeDate();
    console.log(scrapeAndPurgeNeeded);
    if (scrapeAndPurgeNeeded) {
      await this.jobRepository.clear();
      //   //// TRY A LONG CRON JOB

      // scrape each field for each location
      await Promise.all(
        locationSearchesArray.map(
          async (location) =>
            await Promise.all(
              BasefieldSearchesArray.map(
                async (search) =>
                  await this.PersistFromScrape(search, location),
              ),
            ),
        ),
      );
      await this.browser.close();
      // await locationSearchesArray.forEach(async (location) => {
      //   for (let i = 0; i < BasefieldSearchesArray.length; i++) {
      //     console.log(
      //       await this.PersistFromScrape(BasefieldSearchesArray[i], location),
      //     );
      //     console.log('scraped ' + BasefieldSearchesArray[i] + ' ' + location);
      //   }
      // });
    }
  }

  private async scrapeAll() {
    for await (const location of locationSearchesArray) {
      for (let i = 0; i < BasefieldSearchesArray.length; i++) {
        console.log(
          await this.PersistFromScrape(BasefieldSearchesArray[i], location),
        );
        console.log('scraped ' + BasefieldSearchesArray[i] + ' ' + location);
      }
    }
  }
  private async createPage(browser: Browser, url) {
    //Randomize User agent or Set a valid one
    const userAgent = new UserAgent();
    const UA = userAgent.toString();
    const page = await browser.newPage();

    //Randomize viewport size
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });

    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    //Skip images/styles/fonts loading for performance
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (
        // req.resourceType() == 'stylesheet' ||
        req.resourceType() == 'font' ||
        req.resourceType() == 'image'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.evaluateOnNewDocument(() => {
      // Pass webdriver check
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Pass chrome check
      //@ts-ignore
      window.chrome = {
        runtime: {},
        // etc.
      };
    });

    await page.evaluateOnNewDocument(() => {
      //Pass notifications check
      const originalQuery = window.navigator.permissions.query;
      return (window.navigator.permissions.query = (parameters) =>
        //@ts-ignore
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters));
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'plugins', {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5],
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `languages` property to use a custom getter.
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    return page;
  }
  async PersistFromScrape(job: string, location: string) {
    let createJobDtoArray = await this.scrape(job, location);
    createJobDtoArray = this.filterForRelevantJobs(createJobDtoArray, job);
    createJobDtoArray = this.addRemoteBoolean(createJobDtoArray);
    const jobs = this.jobRepository.create(createJobDtoArray);
    return await this.jobRepository.save(jobs);
  }

  async scrape(job: string, location: string) {
    const page = await this.startUpReturnPage(job, location);
    return await this.handlePagination(page);
  }

  private async startUpReturnPage(job: string, location: string) {
    const page = await this.createPage(
      this.browser,
      this.SearchUrlBuilder(job, location),
    );
    return page;
  }

  async parseResults(page: Page) {
    try {
      let jobs = await page.evaluate(async () => {
        const searchWhat: HTMLInputElement =
          document.querySelector('#text-input-what');
        const searchWhere: HTMLInputElement =
          document.querySelector('#text-input-where');
        const container = document.querySelector('#resultsCol');
        const linksNodeList: NodeListOf<HTMLAnchorElement> =
          container.querySelectorAll('a[id^="job_"], a[id^="sj_"]');
        const title = document.querySelectorAll('h2.jobTitle > span');
        const company = document.querySelectorAll('span.companyName');
        const location = document.querySelectorAll('div.companyLocation');
        const incomeCondition = document.querySelectorAll('td.resultContent');
        const jobDescription = document.querySelectorAll('div.job-snippet');
        const income = document.querySelectorAll('span.salary-snippet');
        const utcDate = new Date().toUTCString();
        const NA = 'Not Available';
        let correctedIncome: string[] = [];
        let incomeCounter = 0;
        for (let i = 0; i < linksNodeList.length; i++) {
          if (incomeCondition[i].childElementCount === 4) {
            correctedIncome.push(income[incomeCounter].textContent);
            incomeCounter++;
          } else {
            correctedIncome.push('Not Available');
          }
        }
        let jobArray: CreateJobDto[] = [];
        for (let i = 0; i < linksNodeList.length; i++) {
          jobArray[i] = {
            title: title[i] === undefined ? NA : title[i].textContent.trim(),
            field: searchWhat.value,
            company:
              company[i] === undefined ? NA : company[i].textContent.trim(),
            location:
              location[i] === undefined ? NA : location[i].textContent.trim(),
            searchedLocation: searchWhere.value,
            description:
              jobDescription[i] === undefined
                ? NA
                : jobDescription[i].textContent.trim().replace(/\n|\r/g, ''),
            income: correctedIncome[i],
            link: linksNodeList[i].href,
            date: utcDate,
          };
        }
        return jobArray;
      });
      return jobs;
    } catch (e) {
      console.log('exception at page.evaluate parseResults ', e);
    }
  }

  private async handlePagination(page: Page) {
    let url = page.url();
    let baseUrl = url;
    await page.waitForSelector('#searchCountPages');
    let numberOfResults = await this.getNumberOfResults(page);
    let numberOfPages = Math.round(parseInt(numberOfResults, 10) / 15);
    let offset = 0;
    let pages: CreateJobDto[][] = [];
    return new Promise<CreateJobDto[]>(async (resolve, reject) => {
      try {
        if (numberOfPages <= 1) {
          let jobs: CreateJobDto[] = await this.parseResults(page);
          page.close();
          return resolve(jobs);
        } else {
          for (let i = 0; i < numberOfPages; i++) {
            offset === 0 ? (url = url) : (url = baseUrl + `&start=${offset}`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
            // await page.waitForSelector('span.salary-snippet');
            pages[i] = await this.parseResults(page);
            offset = offset + 10;
          }
          const refactoredPages = this.refactorJobArray(pages);
          page.close();
          return resolve(refactoredPages);
        }
      } catch (e) {
        console.log('Check url for selector issues', url);
        return reject(e);
      }
    });
  }

  private async checkLastScrapeDate() {
    const job = await this.jobRepository.findOne({
      where: { field: baseFieldSearches.softwareDeveloper },
    });
    if (this.getDateDifference(job.date) === 7) return true;
    else return false;
  }

  private getDateDifference(jobDateString: string) {
    const currentDate = new Date();
    const jobDate = new Date(jobDateString);
    const difference = jobDate.getTime() - currentDate.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  private SearchUrlBuilder(job: string, location: string) {
    const jobSearch = job.trim().replace(' ', '%20');
    const url = `https://www.indeed.com/jobs?q=${jobSearch}&l=${location}&jt=parttime`;
    return url;
  }

  private addAdditionalSearchTerms(search: string) {
    let completeSearchTerms: string[] = search.split(' ');
    if (search === baseFieldSearches.softwareDeveloper) {
      completeSearchTerms = completeSearchTerms.concat(softwareDeveloper);
    }
    if (search.includes('ux ui')) {
      completeSearchTerms = completeSearchTerms.concat(softwareDeveloper);
    }
    return completeSearchTerms;
  }

  private filterForRelevantJobs(
    createJobDtoArray: CreateJobDto[],
    job: string,
  ) {
    const removedJobs: CreateJobDto[] = [];
    const filteredJobs: CreateJobDto[] = [];
    let searchTermArray = this.addAdditionalSearchTerms(job);
    for (let i = 0; i < createJobDtoArray.length; i++) {
      let containsTerm = searchTermArray.some((term) => {
        return createJobDtoArray[i].title.toLowerCase().includes(term);
      });
      if (containsTerm) filteredJobs.push(createJobDtoArray[i]);
      else removedJobs.push(createJobDtoArray[i]);
    }
    // to verify results being filtered out
    console.log('search = ' + job);
    removedJobs.forEach((job) => {
      console.log('Removed Job ' + job.title);
    });
    console.log(removedJobs.length);
    return filteredJobs;
  }

  private addRemoteBoolean(createJobDtoArray: CreateJobDto[]) {
    const remote = new RegExp('remote', 'i');
    const remoteChecked: CreateJobDto[] = [];
    for (let i = 0; i < createJobDtoArray.length; i++) {
      let createJobDto: CreateJobDto = createJobDtoArray[i];
      if (createJobDtoArray[i].location.search(remote) === -1) {
        createJobDto.isRemote = false;
      } else createJobDto.isRemote = true;
      remoteChecked.push(createJobDto);
    }
    return remoteChecked;
  }

  private async getNumberOfResults(page: Page) {
    // try reload to avoid Error: failed to find element matching selector "#searchCountPages"
    let numberOfResults = await page.$eval(
      '#searchCountPages',
      (el: HTMLSpanElement) =>
        el.innerText.trim().replace('Page 1 of ', '').replace(' jobs', ''),
    );
    return numberOfResults;
  }

  private refactorJobArray(pages: CreateJobDto[][]) {
    let final: CreateJobDto[] = [];
    for (let i = 0; i < pages.length; i++) {
      pages[i].forEach((job) => {
        final.push(job);
      });
    }
    return final;
  }

  create(createJobDto: CreateJobDto) {
    const job = this.jobRepository.create(createJobDto);
    return this.jobRepository.save(job);
  }

  findAll() {
    return this.jobRepository.find();
  }
}
