import { Module } from '@nestjs/common';
import { ProductsSizeService } from './products-size.service';
import { ProductsSizeController } from './products-size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsSize } from './entities/products-size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsSize])],
  controllers: [ProductsSizeController],
  providers: [ProductsSizeService],
})
export class ProductsSizeModule {}
