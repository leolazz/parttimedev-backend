import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { ApiTags } from '@nestjs/swagger';
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
      'software developer',
      'washington',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
  //   return this.jobsService.update(+id, updateJobDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
