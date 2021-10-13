import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';

describe('JobsService', () => {
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService],
    }).compile();

    jobsService = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(jobsService).toBeDefined();
  });
});
