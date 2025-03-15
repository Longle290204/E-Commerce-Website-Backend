import { Module } from '@nestjs/common';
import { FavoriteProductService } from './favorite_product.service';
import { FavoriteProductController } from './favorite_product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteProduct } from './entities/favorite_product.entity';
import { User } from 'src/auth/user.entity';
import { Product } from 'src/products/Entities/product~entity';

@Module({
   imports: [TypeOrmModule.forFeature([FavoriteProduct, User, Product])],
   controllers: [FavoriteProductController],
   providers: [FavoriteProductService],
})
export class FavoriteProductModule {}
