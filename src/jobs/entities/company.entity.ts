import { Column, Entity, Generated, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, TableForeignKey, Unique } from "typeorm";
import { Job } from "./job.entity";
@Entity()
export class Company {
  
  @Generated()
  id: number;
  
  @PrimaryColumn()
  name: string;

  @Column()
  website: string;

  @Column()
  sector: string;

  @OneToMany(() => Job, job => job.company)
  jobs: Job[];
  
}
