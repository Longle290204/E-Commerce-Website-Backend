import { IsString, IsOptional } from 'class-validator';

export class UpdateProduct {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  imageURL?: string; // Thêm thuộc tính này để lưu URL của ảnh mới
}
