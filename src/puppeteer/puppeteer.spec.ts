import { Test, TestingModule } from '@nestjs/testing';
import { Puppeteer } from './puppeteer';

describe('Puppeteer', () => {
  let provider: Puppeteer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Puppeteer],
    }).compile();

    provider = module.get<Puppeteer>(Puppeteer);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
