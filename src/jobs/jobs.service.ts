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
import { Page, Browser } from 'puppeteer';

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

  async PersistFromScrape(job: string, location: string) {
    const createJobDtoArray = await this.scrape(job, location);
    const jobs = this.jobRepository.create(createJobDtoArray);
    return this.jobRepository.save(jobs);
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
          // id: i,
          title: title[i].textContent.trim(),
          field: search.value,
          company: company[i].textContent.trim(),
          location: location[i].textContent.trim(),
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

  async scrape(job: string, location: string) {
    const page = await this.browser.newPage();
    await page.setViewport({ width: 0, height: 0 });
    let url = this.SearchUrlBuilder(job, location);
    let baseUrl = url;
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
    let numberOfResults = await this.getNumberOfResults(page);
    let numberOfPages = Math.round(parseInt(numberOfResults, 10) / 15);
    let offset = 0;
    let pages: CreateJobDto[][] = [];
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

  private async getNumberOfResults(page: Page) {
    let numberOfResults = await page.$eval(
      '#searchCountPages',
      (el: HTMLSpanElement) =>
        el.innerText.trim().replace('Page 1 of ', '').replace(' jobs', ''),
    );
    return numberOfResults;
  }

  private refactorJobArray(pages: CreateJobDto[][]) {
    let final: CreateJobDto[] = [...pages[0], ...pages[1], ...pages[2]];
    return final;
  }

  // private async preloadCompanyByName(company: Company): Promise<Company> {
  //   const existingCompany = await this.companyRepository.findOne(company);
  //   if (existingCompany) {
  //     return existingCompany;
  //   }
  //   return this.companyRepository.create(company);
  // }

  // async create(createJobDto: CreateJobDto) {
  //   const company = await this.preloadCompanyByName(createJobDto.company);
  //   if (company) {
  //     createJobDto.company = company;
  //   }
  //   const job = this.jobRepository.create(createJobDto);
  //   return this.jobRepository.save(job);
  // }

  findAll() {
    return this.jobRepository.find();
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
