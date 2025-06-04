import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class FormCartDto {
   @IsNotEmpty()
   @IsUUID()
   productId: string;

   @IsOptional()
   @IsNumber()
   @Type(() => Number)
   quantity: number;

   @IsNotEmpty()
   @IsNumber()
   @Type(() => Number)
   sizeId: number; // Số lượng sản phẩm trong giỏ hàng
}
