import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
   constructor(private orderService: OrderService) {}

   @Post()
   createOrder(@Body() dto: CreateOrderDto): Promise<Order[]> {
      return this.orderService.createOrder(dto);
   }

   @Get()
   findAll(): Promise<Order[]> {
      return this.orderService.getOrders();
   }
}
