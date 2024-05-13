import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne,
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

  @Column({ nullable: true })
  couponCode: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  price: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => Product, (product) => product.order)
  products: Product[];
}
