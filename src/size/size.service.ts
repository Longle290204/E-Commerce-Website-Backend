import { Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/createSize.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from './Entity/size.entity';
import { Product } from 'src/products/Entities/product~entity';

@Injectable()
export class SizeService {
   constructor(
      @InjectRepository(Size) private sizeRepository: Repository<Size>,
      @InjectRepository(Product) private productService: Repository<Product>,
   ) {}
   // Add your service methods here
   async createSize(createSizeDto: CreateSizeDto): Promise<Size> {
      const { size } = createSizeDto;
      const newSize = this.sizeRepository.create({ size: size });
      return await this.sizeRepository.save(newSize);
   }

   async getSizes(): Promise<Size[]> {
      return this.sizeRepository.find();
   }

   async deleteSize(id: number): Promise<void> {
      const result = await this.sizeRepository.delete({ id });
      if (result.affected === 0) {
         throw new Error(`Size with ID ${id} not found`);
      }
   }
}
