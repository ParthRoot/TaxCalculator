import { PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity()
export class slabtable {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  slab: string;
}
