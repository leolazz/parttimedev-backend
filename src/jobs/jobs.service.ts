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

@Injectable()
export class JobsService {
  constructor(
  @InjectRepository(Job)
  private readonly jobRepository: Repository<Job>,

  @InjectRepository(Company)
  private readonly companyRepository: Repository<Company>,

  ) {}
  
  private async preloadCompanyByName(company: Company): Promise<Company> {
    const existingCompany = await this.companyRepository.findOne(company);
    if (existingCompany) {
      return existingCompany;
    }
    return this.companyRepository.create(company);
  }
  
  async create(createJobDto: CreateJobDto) {
    const company = await this.preloadCompanyByName(createJobDto.company);
    if(company) { createJobDto.company = company; }
    const job = this.jobRepository.create(createJobDto);
    return this.jobRepository.save(job);
  }

  findAll() {
    return this.jobRepository.find( {relations: ['company']});
  }

  findAllByCompany(company: string) {
    return this.jobRepository.find({where: {company: company}})
  }

  findAllByField(field: Fields) {
    return this.jobRepository.find({where: {field: field}})
  }

  findAllByLocation(location: string) {
    return this.jobRepository.find({where: {location: location}})
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOne(id, {
      relations: ['company'], 
    });
    if(!job) {
      throw new NotFoundException(`Job #${id} not found`)
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
