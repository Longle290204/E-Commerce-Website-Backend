import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'src/products/Entities/product~entity';
import { User } from 'src/auth/user.entity';

@Entity()
export class Cart {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   quantity: number;

   @Column({ type: 'decimal', default: 0 })
   totalPrice: number; // ✅ Tổng giá của sản phẩm trong giỏ

   @ManyToOne(() => Product, (product) => product.cart, {
      eager: true,
      onDelete: 'CASCADE',
   })
   product: Product;

   @ManyToOne(() => User, (user) => user.cart)
   @JoinColumn()
   user: User;
}
