import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product~entity';

@Entity()
export class ProductImages {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   imageUrl: string;

   @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
   product: Product;
}
