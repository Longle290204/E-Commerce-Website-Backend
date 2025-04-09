import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class FormCartDto {
   @IsNotEmpty()
   @IsUUID()
   productId: string;

   @IsNotEmpty()
   @IsNumber()
   @Type(() => Number)
   quantity: number;

   @IsNotEmpty()
   @IsNumber()
   @Type(() => Number)
   sizeId: number; // Số lượng sản phẩm trong giỏ hàng

   // @IsNotEmpty()
   // @IsNumber()
   // @Type(() => Number)
   // totalPrice: number;
}
