import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task~entity';
import { FavoriteProduct } from 'src/favorite_product/entities/favorite_product.entity';
import { Product } from 'src/products/Entities/product~entity';
import { Cart } from 'src/shopping-cart/Cart/entities/cart.entity';

@Entity()
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column({ unique: true })
   username: string;

   @Column({ unique: true })
   phoneNumber: string;

   @Column()
   password: string;

   @Column({ nullable: true })
   refreshToken: string; // Lưu Refresh Token mã hoá

   @OneToMany(() => FavoriteProduct, (favoriteProduct) => favoriteProduct.user)
   favoriteProducts: FavoriteProduct[];

   // @OneToMany((_type) => Product, (product) => product.user, { eager: true })
   // products: Product[];

   @OneToMany(() => Cart, (cart) => cart.user)
   cart: Cart;

   @OneToMany((_type) => Task, (task) => task.user, { eager: true })
   tasks: Task[];
}

// eager: true cho biết rằng mỗi khi thực thể User được truy vấn từ cơ sở
//  dữ liệu, tất cả các tasks liên quan sẽ tự động được tải cùng lúc (eager loading).
