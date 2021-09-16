import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../entities/company.entity';
import { Fields } from '../enums/Fields.enum';

export class CreateJobDto {
  title: string;

  income: string;

  field: string;

  description: string;

  company: string;

  location: string;

  link: string;

  date: string;
}
