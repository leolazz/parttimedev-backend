import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { Job } from './entities/job.entity';
import { InjectBrowser } from 'nest-puppeteer';
import { Page, Browser } from 'puppeteer';
import { softwareDeveloper, uxui } from './searchTerms';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectBrowser()
    private readonly browser: Browser,
  ) {}

  private SearchUrlBuilder(job: string, location: string) {
    const jobSearch = job.trim().replace(' ', '%20');
    const url = `https://www.indeed.com/jobs?q=${jobSearch}&l=${location}&jt=parttime`;
    return url;
  }

  private addAdditionalSearchTerms(search: string) {
    let completeSearchTerms: string[] = search.split(' ');
    if (search.includes('developer')) {
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
      let test = searchTermArray.some((term) => {
        return createJobDtoArray[i].title.toLowerCase().includes(term);
      });
      if (test) filteredJobs.push(createJobDtoArray[i]);
      else removedJobs.push(createJobDtoArray[i]);
    }
    // to verify results being filtered out
    removedJobs.forEach((job) => {
      console.log(job.title);
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

  async PersistFromScrape(job: string, location: string) {
    let createJobDtoArray = await this.scrape(job, location);
    createJobDtoArray = this.filterForRelevantJobs(createJobDtoArray, job);
    createJobDtoArray = this.addRemoteBoolean(createJobDtoArray);
    const jobs = this.jobRepository.create(createJobDtoArray);
    return this.jobRepository.save(jobs);
  }

  async parseResults(page: Page) {
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
      const dateTime = new Date().toLocaleDateString();
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
          title: title[i].textContent.trim(),
          field: searchWhat.value,
          company: company[i].textContent.trim(),
          location: location[i].textContent.trim(),
          searchedLocation: searchWhere.value,
          description: jobDescription[i].textContent
            .trim()
            .replace(/\n|\r/g, ''),
          income: correctedIncome[i],
          link: linksNodeList[i].href,
          date: dateTime,
        };
      }
      return jobArray;
    });
    return jobs;
  }

  private async handlePagination(page: Page) {
    let url = await page.url();
    let baseUrl = url;
    let numberOfResults = await this.getNumberOfResults(page);
    let numberOfPages = Math.round(parseInt(numberOfResults, 10) / 15);
    let offset = 0;
    let pages: CreateJobDto[][] = [];

    if (numberOfPages <= 1) {
      let jobs: CreateJobDto[] = await this.parseResults(page);
      return jobs;
    } else {
      for (let i = 0; i < numberOfPages; i++) {
        offset === 0 ? (url = url) : (url = baseUrl + `&start=${offset}`);
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
        });
        await page.waitForSelector('span.salary-snippet');
        pages[i] = await this.parseResults(page);
        offset = offset + 10;
      }
      return this.refactorJobArray(pages);
    }
  }

  async scrape(job: string, location: string) {
    const page = await this.browser.newPage();
    await page.setViewport({ width: 0, height: 0 });
    await page.goto(this.SearchUrlBuilder(job, location), {
      waitUntil: 'domcontentloaded',
    });
    return await this.handlePagination(page);
  }

  private async getNumberOfResults(page: Page) {
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

  findAllByCompany(company: string) {
    return this.jobRepository.find({ where: { company: company } });
  }

  findAllByField(field: string) {
    return this.jobRepository.find({ where: { field: field } });
  }

  findAllByLocation(location: string) {
    return this.jobRepository.find({ where: { location: location } });
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOne(id, {
      relations: ['company'],
    });
    if (!job) {
      throw new NotFoundException(`Job #${id} not found`);
    }
    return job;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
