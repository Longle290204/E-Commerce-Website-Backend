import { Module } from '@nestjs/common';
import { ProductSizeController } from './product-size.controller';
import { ProductSizeService } from './product-size.service';
import { ProductSize } from './entity/product-size.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Size } from 'src/size/Entity/size.entity';
import { Product } from 'src/products/Entities/product~entity';

@Module({
   imports: [TypeOrmModule.forFeature([ProductSize, Size, Product])],
   providers: [ProductSizeService],
   controllers: [ProductSizeController],
   exports: [ProductSizeService], // Export the service if you need to use it in other modules
})
export class ProductSizeModule {}
