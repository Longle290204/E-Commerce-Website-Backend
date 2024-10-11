import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProductDto } from './dto/create~product.dto';
import { Product } from './product~entity';

@Injectable()
export class ProductService {
  private productRepository = this.dataSource.getRepository(Product);
  constructor(private dataSource: DataSource) {}

  async create(
    createProductDto: CreateProductDto,
    image: Express.Multer.File,
  ): Promise<Product> {
    const { name, price } = createProductDto;
    const imageURL = `http://localhost:3002/uploads/${image.filename}`;
    const product = this.productRepository.create({
      name,
      price,
      imageURL,
    });
    return await this.productRepository.save(product);
  }
}
