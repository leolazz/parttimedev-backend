import { PartialType } from '@nestjs/mapped-types';
import { Column } from 'typeorm';
import { Fields } from '../enums/Fields.enum';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  field: string;

  title: string;

  income: string;

  location: string;
}
