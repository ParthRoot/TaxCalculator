import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity()
export class newtax {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  log: string;

  @Column({ nullable: true })
  body: number;

  @Column({ nullable: true })
  tax: number;
}
