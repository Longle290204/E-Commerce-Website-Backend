import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/products/Entities/product~entity';
import { Size } from 'src/size/Entity/size.entity';

@Entity()
export class ProductSize {
   @PrimaryGeneratedColumn()
   id: number;

   @ManyToOne(() => Product, (product) => product.productSizes, { onDelete: 'CASCADE', eager: true })
   product: Product;

   @ManyToOne(() => Size, (size) => size.productSizes, { eager: true })
   size: Size;

   @Column({ default: 0 })
   stock: number;
}
