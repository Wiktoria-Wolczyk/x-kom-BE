import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("numeric", { nullable: true })
  price: number;

  @Column({ nullable: true })
  discountedPrice: number;

  @Column()
  available: number;

  @Column()
  category: string;

  @Column()
  brand: string;

  @Column({ type: "varchar", nullable: true })
  tag: string;

  @Column({ type: "boolean", nullable: true })
  isHotShot: boolean;

  @Column({ type: "varchar", nullable: true })
  img: string;

  // @ManyToOne(() => Order, (order) => order.products)
  // order: Order;
}
