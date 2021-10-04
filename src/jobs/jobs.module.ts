import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { PuppeteerModule } from 'nest-puppeteer';
import Puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
@Module({
  imports: [TypeOrmModule.forFeature([Job]), PuppeteerModule.forRoot()],
  controllers: [JobsController],
  providers: [
    JobsService,
    {
      provide: 'PuppeteerStealth',
      useValue: Puppeteer.use(StealthPlugin()).launch(),
    },
  ],
})
export class JobsModule {}
