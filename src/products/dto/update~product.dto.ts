import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateProduct {
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    imageURL?: string; // Thêm thuộc tính này để lưu URL của ảnh mới
}
