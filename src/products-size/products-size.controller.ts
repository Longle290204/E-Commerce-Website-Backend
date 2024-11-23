import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsSizeService } from './products-size.service';
import { CreateProductsSizeDto } from './dto/create-products-size.dto';
import { UpdateProductsSizeDto } from './dto/update-products-size.dto';

@Controller('products-size')
export class ProductsSizeController {
  constructor(private readonly productsSizeService: ProductsSizeService) {}

  @Post()
  createSize(@Body() createProductsSizeDto: CreateProductsSizeDto) {
    return this.productsSizeService.createSize(createProductsSizeDto);
  }

  @Get()
  getAllSizes() {
    return this.productsSizeService.getAllSizes();
  }

  @Get(':id')
  getSizeByIds(@Param('id') id: string) {
    return this.productsSizeService.getSizeByIds(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductsSizeDto: UpdateProductsSizeDto) {
    return this.productsSizeService.updateSize(+id, updateProductsSizeDto);
  }

  @Delete(':id')
  deleteSize(@Param('id') id: string) {
    return this.productsSizeService.deleteSize(+id);
  }
}
