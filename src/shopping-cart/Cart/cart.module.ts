import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { GeneralCartService } from '../generalCart.service';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/Entities/product~entity';

@Module({
   imports: [TypeOrmModule.forFeature([Cart, Product])],
   controllers: [CartController],
   providers: [GeneralCartService],
})
export class CartModule {}
