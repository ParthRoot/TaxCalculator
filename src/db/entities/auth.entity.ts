import { PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";

@Entity()
export class authUser {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
