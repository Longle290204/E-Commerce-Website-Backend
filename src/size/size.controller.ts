import { Controller, Body, Post, Get, Delete, Param } from '@nestjs/common';
import { CreateSizeDto } from './dto/createSize.dto';
import { SizeService } from './size.service';
import { Size } from './Entity/size.entity';

@Controller('size')
export class SizeController {
   constructor(private readonly sizeService: SizeService) {}

   @Post()
   createSize(@Body() createSizeDto: CreateSizeDto): Promise<Size> {
      return this.sizeService.createSize(createSizeDto);
   }

   @Get()
   getSizes(): Promise<Size[]> {
      return this.sizeService.getSizes();
   }

   @Delete(':id')
   deleteSize(@Param('id') id: number): Promise<void> {
      return this.sizeService.deleteSize(id);
   }
}
