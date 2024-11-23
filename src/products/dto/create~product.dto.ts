import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsArray()
  // @IsUUID('4', { each: true })
  categoryIds: string[]; // Đây là mảng id của các danh mục
}
