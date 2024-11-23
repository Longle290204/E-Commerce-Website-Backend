import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from 'src/category/entities/category~entity';
import { JoinTable } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageURL: string;

  @Column()
  name: string;

  @Column()
  price: string;

  @ManyToMany((_type) => Category, (category) => category.products, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  categories: Category[];

  // @OneToMany((_type) => ProductsSize, (productSize) => productSize.product)
  // sizes: ProductsSize;
}
// @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
// date_added: Date;

// @Column()
// type: string;

// @Column()
// best_seller: boolean;
