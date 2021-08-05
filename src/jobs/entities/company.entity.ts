import { Column, OneToMany } from "typeorm";
import { Job } from "./job.entity";

export class Company {
  
  @Column()
  name: string;

  @Column()
  website: string;

  @OneToMany(() => Job, job => job.company)
  jobs: Job[];
  
}
