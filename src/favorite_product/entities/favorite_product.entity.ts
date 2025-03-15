import { PrimaryGeneratedColumn, JoinColumn, ManyToOne, Entity } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Product } from 'src/products/Entities/product~entity';

@Entity()
export class FavoriteProduct {
   @PrimaryGeneratedColumn()
   id: string;

   @ManyToOne((_type) => User, (user) => user.favoriteProducts, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'user_id' })
   user: User;

   @ManyToOne((_type) => Product, (product) => product.favoriteProducts, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'product_id' })
   product: Product;
}
