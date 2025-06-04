import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Product } from 'src/products/Entities/product~entity';
import { Size } from 'src/size/Entity/size.entity';

@Entity()
export class Order {
   @PrimaryGeneratedColumn()
   id: number;

   @ManyToOne(() => Product, {cascade: true, onDelete: 'CASCADE'})
   product: Product;

   @ManyToOne(() => Size)
   size: Size;

   @Column()
   quantity: number;

   @CreateDateColumn()
   createdAt: Date;
}
