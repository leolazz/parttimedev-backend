import { type } from "os";
import { Column, Entity, OneToOne, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Fields } from "../enums/Fields.enum";
import { Company } from "./company.entity";

@Entity()
export class Job {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  field: Fields;
  
  @Column()
  title: string;

  @Column()
  income: number;
  
  @ManyToOne(() => Company, company => company.jobs, 
  {
    cascade: true,
    eager: true
  })
  company: Company;

  @Column()
  location: string;
}
