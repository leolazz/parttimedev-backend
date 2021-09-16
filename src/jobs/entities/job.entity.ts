import { type } from 'os';
import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Fields } from '../enums/Fields.enum';
import { Company } from './company.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  field: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  income: string;

  // @ManyToOne(() => Company, company => company.jobs,
  // {
  //   cascade: true,
  //   eager: true
  // })
  @Column()
  company: string;

  @Column()
  location: string;

  @Column()
  link: string;

  @Column()
  date: string;
}
