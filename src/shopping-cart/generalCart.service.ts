import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cart } from './Cart/entities/cart.entity';
import { Product } from 'src/products/Entities/product~entity';
import { FormCartDto } from './dto/FormCart.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Size } from 'src/size/Entity/size.entity';
import { UpdateCartDto } from './Cart/dto/update-cart.dto';
import { ProductSize } from 'src/product-size/entity/product-size.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GeneralCartService {
   private generalRepository;
   private productRepository;
   private sizeRepository;
   private userRepository;
   private productSizeRepository;
   constructor(private dataSource: DataSource) {
      this.generalRepository = this.dataSource.getRepository(Cart);
      this.productRepository = this.dataSource.getRepository(Product);
      this.userRepository = this.dataSource.getRepository(User);
      this.sizeRepository = this.dataSource.getRepository(Size);
      this.productSizeRepository = this.dataSource.getRepository(ProductSize);
   }

   // <--------- Add To Cart --------->
   async addToCart(userId: string, formCartDto: FormCartDto): Promise<Cart> {
      const { productId, quantity, sizeId } = formCartDto;

      // Take product size
      const productSize = await this.productSizeRepository.findOne({
         where: { product: { id: productId }, size: { id: sizeId } },
      });

      if (!productSize) {
         throw new NotFoundException('Product size not found or does not belong to the user');
      }

      // Check if product size is still available
      if (productSize.stock < quantity) {
         throw new HttpException('Out of stock', HttpStatus.BAD_REQUEST);
      }

      // Take product
      const product = await this.productRepository.findOne({
         where: { id: productId },
      });

      if (!product) {
         throw new NotFoundException('Product not found or does not belong to the user');
      }

      // Take size
      const size = await this.sizeRepository.findOne({ where: { id: sizeId } });
      console.log('size-cart', size.size);

      if (!size) {
         throw new NotFoundException('Size not found or does not belong to the user');
      }

      // Kiểm tra xem sản phẩm có cùng size đã tồn tại trong giỏ hàng chưa
      // Nếu có thì tăng quantity lên, nếu không thì tạo mới
      let cart = await this.generalRepository.findOne({
         where: { user: { id: userId }, product: { id: productId }, size: size.size },
         relations: ['user', 'product'], // Thêm quan hệ để tránh lỗi undefined
      });

      if (cart) {
         // cart.quantity ban đầu là 0, vì ta tạo trong entity default là 0
         // quantity ta truyền từ fe qua, nếu quantity = 1 thì cart.quantity = 0 + 1 = 1
         cart.quantity += quantity;
      } else {
         cart = this.generalRepository.create({
            product,
            quantity,
            size: size.size,
            user: { id: userId },
         });
      }

      // ✅ Cập nhật totalPrice cho sản phẩm trong giỏ hàng
      cart.totalPrice = cart.quantity * Number(product.price);

      await this.generalRepository.save(cart);

      return cart;
   }

   // <--------- Get All Cart Item --------->
   async getAllCartItem(userId: string): Promise<{ cartTotal: number; cartItems: Cart[] }> {
      const user = this.generalRepository.findOne({ where: { id: userId } });

      if (!user) {
         throw new NotFoundException(`Not found user`);
      }

      const cartItems = await this.generalRepository.find({ where: { user: { id: userId } } });

      const cartTotal = cartItems.reduce((total: number, item: Cart) => total + Number(item.totalPrice), 0);

      const cartWrapper = {
         cartTotal,
         cartItems,
      };

      return cartWrapper;
   }

   // <--------- Delete All Cart Items --------->
   async deleteAllCartItems(): Promise<void> {
      await this.generalRepository.clear();
   }

   // <--------- Delete Cart Item --------->
   async deleteCartItem(id: string): Promise<void> {
      const result = await this.generalRepository.delete(id);
      if (result.affected === 0) {
         throw new Error('Cart item not found');
      }
   }

   // // <--------- Delete Multiple Cart Items --------->
   // async deleteCartItems(ids: string[]): Promise<void> {
   //    const result = await this.generalRepository.delete(ids);
   //    if (result.affected === 0) {
   //       throw new Error('Cart item not found');
   //    }
   // }

   // <--------- Increment Quantity --------->
   async plusQuantity(userId: string, updateCartDto: UpdateCartDto): Promise<void> {
      const { productId, size } = updateCartDto;

      const product = await this.productRepository.findOne({
         where: { id: productId },
      });

      await this.generalRepository
         .createQueryBuilder()
         .update(Cart)
         .set({ quantity: () => 'quantity + 1', totalPrice: () => `(quantity + 1) * ${Number(product.price)}` })
         .where('productId = :productId', { productId })
         .andWhere('size = :size', { size }) // Đúng cú pháp
         .andWhere('userId = :userId', { userId })
         .execute();
   }

   // <--------- Decrement Quantity --------->
   async minusQuantity(userId: string, updateCartDto: UpdateCartDto): Promise<void> {
      const { productId, size } = updateCartDto;

      const product = await this.productRepository.findOne({
         where: { id: productId },
      });

      await this.generalRepository
         .createQueryBuilder()
         .update(Cart)
         .set({
            quantity: () => 'GREATEST(quantity - 1, 0)',
            totalPrice: () => `GREATEST((quantity - 1), 0) * ${Number(product.price)}`,
         })
         .where('userId = :userId', { userId })
         .andWhere('productId = :productId', { productId })
         .andWhere('size = :size', { size })
         .andWhere('userId = :userId', { userId })
         .execute();
   }

   // <--------- Remove Cart Item If Quantity Is Zero --------->
   async removeIfZero(userId: string, updateCartDto: UpdateCartDto): Promise<void> {
      const { productId, size } = updateCartDto;

      return this.generalRepository
         .createQueryBuilder()
         .delete()
         .from(Cart)
         .where('quantity = 0')
         .andWhere('userId = :userId', { userId })
         .andWhere('productId = :productId', { productId })
         .andWhere('size = :size', { size })
         .execute();
   }

   // <--------- Input Quantity --------->
   async inputQuantity(userId: string, updateCartDto: UpdateCartDto): Promise<void> {
      const { quantity, productId, size } = updateCartDto;
      
      await this.generalRepository
         .createQueryBuilder()
         .update(Cart)
         .set({ quantity: quantity })
         .where('productId = :productId', { productId })
         .andWhere('size = :size', { size })
         .andWhere('userId = :userId', { userId })
         .execute();
   }

   // <--------- Get Quantity --------->
   async getQuantityById(userId: string, productId: string): Promise<number> {
      const cart = await this.generalRepository.findOne({
         where: { user: { id: userId }, product: { id: productId } },
      });
      return cart ? cart.quantity : 0;
   }

   // <--------- Get All Quantity --------->
   async getAllQuantity(userId: string): Promise<{ productId: string; quantity: number }[]> {
      try {
         const cartItems: Cart[] = await this.generalRepository.find({ where: { user: { id: userId } } });
         if (!cartItems || cartItems.length === 0) {
            return [];
         }
         return cartItems.map((item) => ({
            productId: item.product?.id || 'unknown',
            quantity: item.quantity || 0,
         }));
      } catch (error) {
         // You may want to log the error or handle it accordingly
         throw new Error('Failed to fetch cart quantities');
      }
   }

   // <--------- Get Cart Total Price Product --------->
   // async getCartTotalPricePer(userId: string, productId: string): Promise<number> {
   //    const cart = await this.generalRepository.findOne({
   //       where: { user: { id: userId }, product: { id: productId } },
   //    });
   //    return cart ? cart.totalPrice : 0;
   // }

   // <--------- Get Cart Total Price --------->
   // async getCartTotalPrice(userId: string): Promise<number> {
   //    const cartItems: Cart[] = await this.generalRepository.find({ where: { user: { id: userId } } });
   //    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
   // }
}
