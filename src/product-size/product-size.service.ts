import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from 'src/size/Entity/size.entity';
import { ProductSize } from './entity/product-size.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductSizeDto } from './dto/createProductSize.dto';
import { Product } from 'src/products/Entities/product~entity';
import { UpdateProductStockDto } from './dto/updateProductsize.dto';
import { GetStockDto } from './dto/getStock.dto';

@Injectable()
export class ProductSizeService {
   constructor(
      @InjectRepository(ProductSize) private productSizeRepository: Repository<ProductSize>,
      @InjectRepository(Size) private sizeRepository: Repository<Size>,
      @InjectRepository(Product) private productRepository: Repository<Product>,
   ) {}

   async createProductSize(createProductDto: CreateProductSizeDto): Promise<ProductSize> {
      // Lưu cặp product-size vào bảng product_size
      console.log('sizeId', createProductDto.sizeIds);
      // console.log('sizes', size);

      for (const sizeId of createProductDto.sizeIds) {
         const size = await this.sizeRepository.findOne({ where: { id: sizeId } });
         if (!size) {
            throw new HttpException('Size not found', HttpStatus.BAD_REQUEST);
         }
         const product = await this.productRepository.findOne({ where: { id: createProductDto.productId } });
         const productSize = this.productSizeRepository.create({
            product,
            size,
         });

         return this.productSizeRepository.save(productSize);
      }
   }

   getProductSizes(): Promise<ProductSize[]> {
      return this.productSizeRepository.find({ relations: ['product', 'size'] });
   }

   // Assign sizes to product
   async assignSizesToProduct(productId: string, sizeIds: number[]): Promise<void> {
      const product = await this.productRepository.findOneBy({ id: productId });
      for (const sizeId of sizeIds) {
         console.log('sizeId', sizeIds);
         console.log('size', typeof sizeIds);

         const size = await this.sizeRepository.findOneBy({ size: sizeId });

         console.log('size', size.size);

         if (!size) {
            throw new HttpException('Size not found', HttpStatus.BAD_REQUEST);
         }

         await this.productSizeRepository.save({
            product,
            size: size,
         });
      }
   }

   async updateStock(UpdateProductStockDto: UpdateProductStockDto) {
      const { productId, sizeId, stock } = UpdateProductStockDto;

      const productSize = await this.productSizeRepository.findOne({
         where: { product: { id: productId }, size: { id: sizeId } },
      });

      if (!productSize) {
         throw new HttpException('Product size not found', HttpStatus.NOT_FOUND);
      }

      productSize.stock += stock; // Update the stock value

      await this.productSizeRepository.save(productSize);
   }

   async getStock(getStockDto: GetStockDto): Promise<number> {
      const { productId, sizeId } = getStockDto;

      console.log('productId', typeof productId);
      console.log('sizeId', sizeId);

      const productSize = await this.productSizeRepository.findOne({
         where: { product: { id: productId }, size: { id: sizeId } },
      });

      if (!productSize) {
         throw new HttpException('Product size not found', HttpStatus.NOT_FOUND);
      }

      return productSize.stock;
   }
}
