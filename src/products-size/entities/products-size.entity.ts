import { Product } from 'src/products/product~entity';
import { Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne, Column } from 'typeorm';

@Entity()
export class ProductsSize {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: number;

  @Column()
  size: number;

  @Column()
  quantity: number;

  // @ManyToOne((_type) => Product, (product) => product.sizes, { onDelete: 'CASCADE' }) // Sử dụng CASCADE để xóa ProductsSize khi Product bị xóa (nếu cần)
  // @JoinColumn({ name: 'productId' })
  product: Product;
}
