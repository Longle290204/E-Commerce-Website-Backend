import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  Get,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create~product.dto';
import { ProductService } from './product.service';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Product } from './product~entity';
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
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
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
      const product = await this.productService.createProduct(
        createProductDto,
        image,
      );
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
  @Get('category/:id')
  getProductsByCategory(@Param('id') categoryId: number): Promise<Product[]> {
    return this.productService.getProductsByCategory(categoryId);
  }

  @Get('/:id')
  getProductById(@Param() id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  @Get()
  getProductFilterDto(@Query() filterDto: GetFilterDto): Promise<Product[]> {
    return this.productService.getProductsFilterDto(filterDto);
  }

  @Put('/:id/image/name/price')
  @UseInterceptors(FileInterceptor('image')) // xử lý file ảnh
  updateProduct(
    @Param('id') id: string,
    @Body() updateProduct: UpdateProduct,
    @UploadedFile() image: Express.Multer.File, // nhận file từ request
  ): Promise<Product> {
    const { name, price } = updateProduct;
    const imageURL = image
      ? `http://localhost:3002/uploads/${image.filename}`
      : null;
    return this.productService.updateProduct(id, name, price, imageURL);
  }
}
