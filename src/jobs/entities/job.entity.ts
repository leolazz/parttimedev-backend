import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  company: string;

  @Column()
  location: string;

  @Column()
  link: string;

  @Column()
  date: string;
}
