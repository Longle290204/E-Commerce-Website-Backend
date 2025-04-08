import { Controller, Body, Post, Get } from '@nestjs/common';
import { ProductSizeService } from './product-size.service';
import { CreateProductSizeDto } from './dto/createProductSize.dto';

@Controller('product-size')
export class ProductSizeController {
   constructor(private productSizeService: ProductSizeService) {}

   @Post()
   createProductSize(@Body() createProductSizeDto: CreateProductSizeDto) {
      return this.productSizeService.createProductSize(createProductSizeDto);
   }

   @Get()
   getProductSizes() {
      return this.productSizeService.getProductSizes();
   }
}
