import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Fields } from "../enums/Fields.enum";
import { Company } from "./company.entity";

@Entity()
export class Job {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  field: Fields
  
  @Column()
  title: string;

  @Column()
  income: number;
  
  @ManyToOne(() => Company, company => company.jobs)
  company: Company;

  @Column()
  location: string;
}
