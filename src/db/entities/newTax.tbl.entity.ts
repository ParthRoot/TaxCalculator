import { PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity()
export class newtax {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  log: string;

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  tax: number;

  @Column({ nullable: true })
  typeTax: string;

  @CreateDateColumn()
  time: Date;
}
