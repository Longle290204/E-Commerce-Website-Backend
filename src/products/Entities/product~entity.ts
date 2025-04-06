
import {
   Column,
   Entity,
   ManyToMany,
   OneToMany,
   JoinTable,
   ManyToOne,
   PrimaryGeneratedColumn,
   BeforeInsert,
} from 'typeorm';
import { Category } from 'src/category/entities/category~entity';
import { Cart } from 'src/shopping-cart/Cart/entities/cart.entity';
import { FavoriteProduct } from 'src/favorite_product/entities/favorite_product.entity';
import { User } from 'src/auth/user.entity';
import { ProductImages } from './productImages.entity';
import { ProductSize } from 'src/product-size/entity/product-size.entity';
import * as removeAccents from 'remove-accents';

export enum ProductStatus {
   ACTIVE = 'ACTIVE',
   INACTIVE = 'INACTIVE',
}

@Entity()
export class Product {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   mainImage: string;

   @Column({ type: 'varchar', length: 255 })
   name: string;

   @Column({ type: 'decimal', default: 0 })
   price: number;

   @Column({ type: 'decimal', default: 0 })
   discount: number;

   @ManyToMany((_type) => Category, (category) => category.products, {
      cascade: true,
      eager: true,
      onDelete: 'CASCADE',
   })
   @JoinTable()
   categories: Category[];

   @ManyToOne(() => Category, { nullable: true, eager: true })
   mainCategory: Category; // Danh mục chính

   @OneToMany((_type) => Cart, (cart) => cart.product)
   cart: Cart[];

   @OneToMany(() => FavoriteProduct, (favoriteProduct) => favoriteProduct.product)
   favoriteProducts: FavoriteProduct[];

   @ManyToMany(() => User, (user) => user.favoriteProducts)
   user: User;

   @OneToMany(() => ProductImages, (productImages) => productImages.product, { cascade: true, eager: true })
   images: ProductImages[];

   @Column({
      type: 'enum',
      enum: ProductStatus,
      default: ProductStatus.ACTIVE,
   })
   status: ProductStatus;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   createdAt: Date;

   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   upDatedAt: Date;
}
