import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Product } from 'src/products/Entities/product~entity';
import { Size } from 'src/size/Entity/size.entity';
import { ProductSize } from 'src/product-size/entity/product-size.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Order, ProductSize])],
   controllers: [OrderController],
   providers: [OrderService],
   exports: [],
})
export class OrderModule {}
