import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { type } from 'os';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    JobsModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.DATABASE_USER,
      autoLoadEntities: true,
      synchronize: true,
  }), 
],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule {}
