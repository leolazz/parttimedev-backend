import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Job } from "./job.entity";
@Entity()
export class Company {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @Column()
  website: string;

  @OneToMany(() => Job, job => job.company)
  jobs: Job[];
  
}
