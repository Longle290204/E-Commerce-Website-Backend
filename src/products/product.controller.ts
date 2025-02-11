import { Controller, Post, UploadedFile, UseInterceptors, Body, Get, Param, Delete, Query, Put } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create~product.dto';
import { ProductService } from './product.service';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Product } from './Entities/product~entity';
import { GetFilterDto } from './dto/get~product.dto';
import { UpdateProduct } from './dto/update~product.dto';

@Controller('products')
export class ProductController {
   constructor(private productService: ProductService) {}

   @Post()
   @UseInterceptors(
      FileInterceptor('image', {
         storage: diskStorage({
            destination: './uploads',
         }),
      }),
   )
   async createProduct(
      @Body() createProductDto: CreateProductDto,
      @UploadedFile() image: Express.Multer.File,
   ): Promise<any> {
      if (!image) {
         throw new HttpException('File is required.', HttpStatus.BAD_REQUEST);
      }
      try {
         const product = await this.productService.createProduct(createProductDto, image);
         return {
            statusCode: HttpStatus.CREATED,
            message: 'Product created successfully',
            data: product,
         };
      } catch (error) {
         throw new HttpException(
            { message: 'Error creating product', error: error.message },
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }
   }

   @Post(':id/thumbnail')
   addThumbnails(@Param('id') productId: string, @Body('images') images: string[]) {
      return this.productService.addThumbnails(productId, images);
   }

   // @Get()
   // async getProduct(
   //   @Query('type') type: string,
   //   @Query('category') category: ProductCategory,
   // ): Promise<Product[]> {
   //   // if (type === 'new') {
   //   //   return this.productService.getNewProduct();
   //   // } else if (category) {
   //   //   return this.productService.getCategoryProduct(category);
   //   // } else if (type === 'best-seller') {
   //   //   return this.productService.getBestSeller();
   //   // // }
   //   // if (category) {
   //   //   return this.productService.getCategoryProduct(category);
   //   // }
   //   return await this.productService.getProducts();
   // }

   // @Get('category/:id')

   @Get('category/:id')
   getProductsByCategory(@Param('id') categoryId: string): Promise<Product[]> {
      return this.productService.getProductsByCategory(categoryId);
   }

   @Get()
   getProductFilterDto(@Query() filterDto: GetFilterDto): Promise<Product[]> {
      return this.productService.getProductsFilterDto(filterDto);
   }

   @Get('/:id')
   getProductById(@Param('id') id: string): Promise<Product> {
      return this.productService.getProductById(id);
   }

   @Delete('/:id')
   deleteProduct(@Param('id') id: string): Promise<void> {
      return this.productService.deleteProduct(id);
   }

   @Put('/:id/image/name/price')
   @UseInterceptors(
      FileInterceptor('image', {
         storage: diskStorage({
            destination: './uploads',
         }),
      }),
   ) // xử lý file ảnh
   updateProduct(
      @Param('id') id: string,
      @Body() updateProduct: UpdateProduct,
      @UploadedFile() image: Express.Multer.File, // nhận file từ request
   ): Promise<Product> {
      const { name, price } = updateProduct;
      const imageURL = image ? `http://localhost:3002/uploads/${image.filename}` : null;
      return this.productService.updateProduct(id, name, price, imageURL);
   }
}
