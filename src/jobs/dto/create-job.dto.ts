import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "../entities/company.entity";
import { Fields } from "../enums/Fields.enum";

export class CreateJobDto {
  
  title: string;

  income: number;
  
  field: Fields

  company: Company;

  location: string;
}
