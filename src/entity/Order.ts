import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column()
  couponCode: string;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => Product, (product) => product.order)
  products: Product[];
}
