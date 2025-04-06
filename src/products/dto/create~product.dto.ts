import { IsNotEmpty, IsString, IsArray, IsUUID, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';
import { ProductStatus } from '../Entities/product~entity';

export class CreateProductDto {
   @IsNotEmpty()
   @IsString()
   name: string;

   @IsNotEmpty()
   @Transform(({ value }) => parseFloat(value))
   @IsNumber()
   price: number;

   @IsArray()
   @IsUUID('4', { each: true })
   @Type(() => String)
   categoryId: string[]; // Đây là mảng id của các danh mục

   @IsNotEmpty()
   @IsEnum(ProductStatus)
   status: ProductStatus;

   @IsString()
   @IsOptional()
   mainCategoryId?: string; // Danh mục chính (có thể để trống)
}
