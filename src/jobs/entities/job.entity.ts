import { type } from "os";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Fields } from "../enums/Fields.enum";

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
  
  @Column()
  company: string;

  @Column()
  location: string;
}
