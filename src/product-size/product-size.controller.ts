import { Controller, Body, Post, Get, Patch, Query } from '@nestjs/common';
import { ProductSizeService } from './product-size.service';
import { CreateProductSizeDto } from './dto/createProductSize.dto';
import { UpdateProductStockDto } from './dto/updateProductsize.dto';
import { GetStockDto } from './dto/getStock.dto';

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

   @Get('/getStock')
   getStock(@Query() getStockDto: GetStockDto): Promise<number> {
      return this.productSizeService.getStock(getStockDto);
   }

   @Patch('/updateStock')
   updateStock(@Body() updateProductStockDto: UpdateProductStockDto) {
      return this.productSizeService.updateStock(updateProductStockDto);
   }
}
