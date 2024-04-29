import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  discountedPrice: number;

  @Column()
  available: number;

  @Column()
  category: string;

  @ManyToOne(() => Order, (order) => order.products)
  order: Order;
}
