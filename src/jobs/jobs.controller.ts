import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags } from '@nestjs/swagger';
import { Fields } from './enums/Fields.enum';
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
  findAllByField(@Param('field') field: Fields) {
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
    let test = await this.jobsService.scrape(
      'software developer',
      'washington',
    );
    console.log('pages scraped' + test.length);
    test.forEach((test) => {
      console.log('jobs per page' + test.length);
    });
    console.log(test);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
