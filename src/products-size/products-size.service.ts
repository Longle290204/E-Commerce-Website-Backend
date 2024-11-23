import { Injectable } from '@nestjs/common';
import { CreateProductsSizeDto } from './dto/create-products-size.dto';
import { UpdateProductsSizeDto } from './dto/update-products-size.dto';
import { DataSource } from 'typeorm';
import { ProductsSize } from './entities/products-size.entity';

@Injectable()
export class ProductsSizeService {
  productSizeRepository = this.dataSource.getRepository(ProductsSize);
  constructor(private dataSource: DataSource) {}
  createSize(createProductsSizeDto: CreateProductsSizeDto) {
    return 'This action adds a new productsSize';
  }

  getAllSizes() {
    return `This action returns all productsSize`;
  }

  getSizeByIds(id: number) {
    return `This action returns a #${id} productsSize`;
  }

  updateSize(id: number, updateProductsSizeDto: UpdateProductsSizeDto) {
    return `This action updates a #${id} productsSize`;
  }

  deleteSize(id: number) {
    return `This action removes a #${id} productsSize`;
  }
}
