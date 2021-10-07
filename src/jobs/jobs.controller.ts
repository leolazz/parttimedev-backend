import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  baseFieldSearches,
  BasefieldSearchesArray,
  locationSearches,
  locationSearchesArray,
} from './searchTerms';
@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get('/company/:company')
  findAllByCompany(@Param('company') company: string) {
    return this.jobsService.findAllByCompany(company);
  }

  @Get('/field/:field')
  findAllByField(@Param('field') field: string) {
    return this.jobsService.findAllByField(field);
  }

  @Get('/location/:location')
  findAllByLocation(@Param('location') location: string) {
    return this.jobsService.findAllByLocation(location);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get('/scrape/')
  async scrapeAndPersist() {
    return await this.jobsService.PersistFromScrape(
      baseFieldSearches.softwareDeveloper,
      locationSearches.california,
    );
  }
  @Get('/test/')
  async TestscrapeAndPersist() {
    return await this.jobsService.cronScrape();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
