import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsController } from './jobs/jobs.controller';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [JobsModule, TypeOrmModule.forRoot(), ],
  controllers: [AppController, JobsController],
  providers: [AppService],
})
export class AppModule {}
