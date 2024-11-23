import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProductDto } from './dto/create~product.dto';
import { Product } from './product~entity';
import { NotFoundException } from '@nestjs/common';
import { GetFilterDto } from './dto/get~product.dto';
import { In } from 'typeorm';
import { Category } from 'src/category/entities/category~entity';

@Injectable()
export class ProductService {
  private productRepository = this.dataSource.getRepository(Product);
  private categoryRepository = this.dataSource.getRepository(Category);
  constructor(private dataSource: DataSource) {}

  async createProduct(
    createProductDto: CreateProductDto,
    image: Express.Multer.File,
  ): Promise<Product> {
    const { name, price, categoryIds } = createProductDto;
    const imageURL = `http://localhost:3002/uploads/${image.filename}`;

    const categories = await this.categoryRepository.find({
      where: { id: In(categoryIds || []) },
    });

    const product = this.productRepository.create({
      name,
      price,
      imageURL,
      categories,
    });
    console.log(product);

    return await this.productRepository.save(product);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .getMany();
  }

  async getProductById(id: string): Promise<Product> {
    const found = await this.productRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return found;
  }

  getProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async getProductsFilterDto(filterDto: GetFilterDto): Promise<Product[]> {
    const { search } = filterDto;
    const query = this.productRepository.createQueryBuilder('product');

    query.leftJoinAndSelect('product.categories', 'category');

    if (search) {
      query.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.price) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const products = await query.getMany();
      return products;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // async getNewProduct(): Promise<Product[]> {
  //   const tenDayAgo = new Date();
  //   tenDayAgo.setDate(tenDayAgo.getDate() - 10);

  //   return await this.productRepository.find({
  //     where: { date_added: MoreThanOrEqual(tenDayAgo) },
  //   });
  // }

  // async getBestSeller(): Promise<Product[]> {
  //   return await this.productRepository.find({
  //     where: { best_seller: true },
  //   });
  // }

  // async getCategoryProduct(category: ProductCategory): Promise<Product[]> {
  //   return await this.productRepository.find({ where: { category: category } });
  // }

  async updateProduct(
    id: string,
    name: string,
    price: string,
    imageURL?: string,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    product.name = name;
    product.price = price;
    if (imageURL) {
      product.imageURL = imageURL;
    }
    await this.productRepository.save(product);
    return product;
  }
}
