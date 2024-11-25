import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from 'src/products/Entities/product~entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany((_type) => Product, (product) => product.categories, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  products: Product[];

  @ManyToOne((_type) => Category, (category) => category.subcategories)
  parent: Category;

  @OneToMany((_type) => Category, (category) => category.parent)
  subcategories: Category[];
}
