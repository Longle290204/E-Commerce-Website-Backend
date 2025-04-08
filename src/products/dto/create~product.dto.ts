import { IsNotEmpty, IsString, IsArray, IsUUID, IsNumber, IsOptional, IsEnum, IsInt } from 'class-validator';
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

   @IsArray()
   @IsOptional()
   @IsInt({ each: true })
   @Transform(({ value }) => value.map(Number))
   sizeIds?: number[]; // Danh sách id của các size sản phẩm, có thể để trống nếu không có size nào được chọn
}
