import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  DataSource,
  OneToMany,
} from "typeorm";
import { Order } from "./Order";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
