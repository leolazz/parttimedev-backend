import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Company } from './entities/company.entity';
import { PuppeteerModule } from 'nest-puppeteer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, Company]),
    PuppeteerModule.forRoot(),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
