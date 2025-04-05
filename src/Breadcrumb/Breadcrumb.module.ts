import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/Entities/product~entity';
import { BreadcrumbController } from './Breadcrumb.controller';
import { BreadcrumbService } from './Breadcrumb.service';
import { Category } from 'src/category/entities/category~entity';

@Module({
   imports: [TypeOrmModule.forFeature([Product, Category])],
   controllers: [BreadcrumbController],
   providers: [BreadcrumbService],
   exports: [],
})
export class BreadcrumbModule {}
