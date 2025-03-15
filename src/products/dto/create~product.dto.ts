import { IsNotEmpty, IsString, IsArray, IsUUID, isNumber, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

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
   categoryId: string[]; // Đây là mảng id của các danh mục
}
