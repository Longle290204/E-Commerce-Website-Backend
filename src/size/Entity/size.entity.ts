import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ProductSize } from 'src/product-size/entity/product-size.entity';

@Entity()
export class Size {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ unique: true })
   size: number;

   @OneToMany(() => ProductSize, (productSize) => productSize.size)
   productSizes: ProductSize[];
}
