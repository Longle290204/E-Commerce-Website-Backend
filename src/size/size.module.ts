import { Module } from '@nestjs/common';
import { SizeController } from './size.controller';
import { Size } from './Entity/size.entity';
import { SizeService } from './size.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/Entities/product~entity';

@Module({
   imports: [TypeOrmModule.forFeature([Size, Product])], // Add your entity here if needed
   controllers: [SizeController],
   providers: [SizeService],
   exports: [SizeService], // Export the service if you need to use it in other modules
})
export class SizeModule {}
