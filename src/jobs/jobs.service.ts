import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringify } from 'querystring';
import { combineAll } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Company } from './entities/company.entity';
import { Job } from './entities/job.entity';
import { Fields } from './enums/Fields.enum';
import { InjectBrowser } from 'nest-puppeteer';
import { Page, Browser, ElementHandle, Puppeteer } from 'puppeteer';
import * as puppeteer from 'puppeteer';
import e from 'express';
import { off } from 'process';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectBrowser() private readonly browser: Browser,
  ) {}

  private SearchUrlBuilder(job: string, location: string) {
    const jobSearch = job.trim().replace(' ', '%20');
    const url = `https://www.indeed.com/jobs?q=${jobSearch}&l=${location}&jt=parttime`;
    return url;
  }

  async getPageUrls() {}

  private correctIncome(
    results: NodeListOf<HTMLAnchorElement>,
    incomeCondition: NodeListOf<Element>,
    income: NodeListOf<Element>,
  ) {
    let correctedIncome: string[] = [];
    let incomeCounter = 0;
    for (let i = 0; i < results.length; i++) {
      if (incomeCondition[i].childElementCount === 4) {
        correctedIncome.push(income[incomeCounter].textContent);
        incomeCounter++;
      } else {
        correctedIncome.push('Not Available');
      }
    }
    return correctedIncome;
  }

  async parseResults(page: Page) {
    let jobs = await page.evaluate(async () => {
      const search: HTMLInputElement =
        document.querySelector('#text-input-what');
      const container = document.querySelector('#resultsCol');
      const linksNodeList: NodeListOf<HTMLAnchorElement> =
        container.querySelectorAll('a[id^="job_"], a[id^="sj_"]');
      const title = document.querySelectorAll('h2.jobTitle > span');
      const company = document.querySelectorAll('span.companyName');
      const location = document.querySelectorAll('div.companyLocation');
      const incomeCondition = document.querySelectorAll('td.resultContent');
      const jobDescription = document.querySelectorAll('div.job-snippet');
      const income = document.querySelectorAll('span.salary-snippet');
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
      let jobArray = [];
      for (let i = 0; i < linksNodeList.length; i++) {
        jobArray[i] = {
          id: i,
          title: title[i].textContent.trim(),
          field: search.value,
          company: company[i].textContent.trim(),
          location: location[i].textContent.trim(),
          description: jobDescription[i].textContent
            .trim()
            .replace(/\n|\r/g, ''),
          income: correctedIncome[i],
          link: linksNodeList[i].href,
        };
      }
      return jobArray;
    });
    return jobs;
  }

  async scrape(job: string, location: string) {
    const page = await this.browser.newPage();
    await page.setViewport({ width: 0, height: 0 });
    // const browser = await puppeteer.launch({
    //   headless: false,
    //   defaultViewport: null,
    // });
    // const page = await browser.newPage();
    let url = this.SearchUrlBuilder(job, location);
    let baseUrl = url;
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
    let numberOfResults = await page.$eval(
      '#searchCountPages',
      (el: HTMLSpanElement) =>
        el.innerText.trim().replace('Page 1 of ', '').replace(' jobs', ''),
    );
    console.log(numberOfResults);
    let floatingPointPageNumber = parseInt(numberOfResults, 10) / 15;
    console.log(floatingPointPageNumber);
    let numberOfPages = Math.round(floatingPointPageNumber);
    console.log(numberOfPages);
    let offset = 0;
    let pages = [];
    for (let i = 0; i < numberOfPages; i++) {
      offset === 0 ? (url = url) : (url = baseUrl + `&start=${offset}`);
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });
      // console.log(url);
      console.log(page.url());
      await page.waitForSelector('span.salary-snippet');
      pages[i] = await this.parseResults(page);
      offset = offset + 10;
    }

    // await page.exposeFunction('correctIncome', this.correctIncome);
    // let offset = 0;
    // for (let i = 0; i < numberOfPages; i++) {
    //   offset === 0 ? (url = url) : (url = url + `&start=${offset}`);
    //   await page.goto(url, {
    //     waitUntil: 'domcontentloaded',
    //   });
    //   await page.waitForSelector('span.salary-snippet');
    //   pages[i] = await this.parseResults(page);
    //   offset = offset + 10;
    // }
    return pages;
  }

  // async scrape(job: string, location: string) {
  //   return new Promise<any[]>(async (resolve, reject) => {
  //     try {
  //       const page = await this.browser.newPage();
  //       await page.goto(this.SearchUrlBuilder(job, location), {
  //         waitUntil: 'domcontentloaded',
  //       });
  //       await page.waitForSelector('span.salary-snippet');
  //       await page.exposeFunction('correctIncome', this.correctIncome);
  //       let jobs = await page.evaluate(async () => {
  //         const search: HTMLInputElement =
  //           document.querySelector('#text-input-what');
  //         const container = document.querySelector('#resultsCol');
  //         const linksNodeList: NodeListOf<HTMLAnchorElement> =
  //           container.querySelectorAll('a[id^="job_"], a[id^="sj_"]');
  //         const title = document.querySelectorAll('h2.jobTitle > span');
  //         const company = document.querySelectorAll('span.companyName');
  //         const location = document.querySelectorAll('div.companyLocation');
  //         const incomeCondition = document.querySelectorAll('td.resultContent');
  //         const jobDescription = document.querySelectorAll('div.job-snippet');
  //         const income = document.querySelectorAll('span.salary-snippet');
  //         let correctedIncome = this.correctIncome(
  //           linksNodeList,
  //           incomeCondition,
  //           income,
  //         );

  //         let jobArray = [];
  //         for (let i = 0; i < linksNodeList.length; i++) {
  //           jobArray[i] = {
  //             id: i,
  //             title: title[i].textContent.trim(),
  //             field: search.value,
  //             company: company[i].textContent.trim(),
  //             location: location[i].textContent.trim(),
  //             description: jobDescription[i].textContent
  //               .trim()
  //               .replace(/\n|\r/g, ''),
  //             income: correctedIncome[i],
  //             link: linksNodeList[i].href,
  //           };
  //         }
  //         return jobArray;
  //       });
  //       this.browser.close();
  //       return resolve(jobs);
  //     } catch (e) {
  //       return reject(e);
  //     }
  //   });
  // }

  private async preloadCompanyByName(company: Company): Promise<Company> {
    const existingCompany = await this.companyRepository.findOne(company);
    if (existingCompany) {
      return existingCompany;
    }
    return this.companyRepository.create(company);
  }

  async create(createJobDto: CreateJobDto) {
    const company = await this.preloadCompanyByName(createJobDto.company);
    if (company) {
      createJobDto.company = company;
    }
    const job = this.jobRepository.create(createJobDto);
    return this.jobRepository.save(job);
  }

  findAll() {
    return this.jobRepository.find({ relations: ['company'] });
  }

  findAllByCompany(company: string) {
    return this.jobRepository.find({ where: { company: company } });
  }

  findAllByField(field: Fields) {
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

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
