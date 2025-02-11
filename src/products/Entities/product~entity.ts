import { Column, Entity, ManyToMany, OneToMany, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from 'src/category/entities/category~entity';
import { Cart } from 'src/shopping-cart/Cart/entities/cart.entity';
import { FavoriteProduct } from 'src/favorite_product/entities/favorite_product.entity';
import { User } from 'src/auth/user.entity';
import { ProductImages } from './productImages.entity';

@Entity()
export class Product {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   mainImage: string;

   @Column({ type: 'varchar', length: 255 })
   name: string;

   @Column()
   price: string;

   @ManyToMany((_type) => Category, (category) => category.products, {
      cascade: true,
      eager: true,
   })
   @JoinTable()
   categories: Category[];

   @OneToMany((_type) => Cart, (cart) => cart.product)
   cart: Cart[];

   @OneToMany(() => FavoriteProduct, (favoriteProduct) => favoriteProduct.product)
   favoriteProducts: FavoriteProduct[];

   @ManyToOne(() => User, (user) => user.products)
   user: User;

   @OneToMany(() => ProductImages, (productImages) => productImages.product, { cascade: true, eager: true })
   images: ProductImages[];
}
