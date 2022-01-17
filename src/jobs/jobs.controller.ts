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
  @Get()
  findAll() {
    return this.jobsService.findAll();
  }
}
