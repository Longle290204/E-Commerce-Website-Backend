import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { Product } from './../products/Entities/product~entity';
import { Size } from '../size/Entity/size.entity';
import { ProductSize } from 'src/product-size/entity/product-size.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
   constructor(
      @InjectRepository(Order) private orderRepo: Repository<Order>,
      @InjectRepository(ProductSize) private productSizeRepo: Repository<ProductSize>,
   ) {}

   async createOrder(dto: CreateOrderDto): Promise<Order[]> {
      const order: Order[] = [];

      for (const item of dto.orders) {
         const productSize = await this.productSizeRepo.findOne({
            where: { product: { id: item.productId }, size: { size: item.size } },
         });

         if (!productSize) {
            throw new NotFoundException('Product - size not found');
         }

         if (productSize.stock < item.quantity) {
            throw new HttpException('Not enough stock', HttpStatus.BAD_REQUEST);
         }

         productSize.stock -= item.quantity;
         await this.productSizeRepo.save(productSize);

         const orderItem = this.orderRepo.create({
            product: productSize.product,
            size: productSize.size,
            quantity: item.quantity,
         });

         order.push(await this.orderRepo.save(orderItem)); // await this.orderRepo.save(orderItem);
      }

      return order;
   }

   async getOrders(): Promise<Order[]> {
      return this.orderRepo.find({ relations: ['product', 'size'] });
   }
}
