import { Company } from './company.entity';

describe('Company', () => {
  it('should be defined', () => {
    expect(new Company()).toBeDefined();
  });
});
