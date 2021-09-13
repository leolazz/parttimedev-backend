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
import { Browser } from 'puppeteer';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectBrowser() private readonly browser: Browser,
  ) {}

  async scrape() {
    return new Promise<Object[]>(async (resolve, reject) => {
      try {
        const page = await this.browser.newPage();
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
          let checkedIncome: string[] = [];
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
        this.browser.close();
        return resolve(jobs);
      } catch (e) {
        return reject(e);
      }
    });
  }

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
