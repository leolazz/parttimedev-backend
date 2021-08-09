import { PartialType } from '@nestjs/mapped-types';
import { Column, } from 'typeorm';
import { Fields } from '../enums/Fields.enum';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {

  field: Fields
  
  title: string;

  income: number;

  location: string;
}
