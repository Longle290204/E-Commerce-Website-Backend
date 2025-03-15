import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { UUID } from 'crypto';
export class FormCartDto {
   @IsNotEmpty()
   @IsUUID()
   productId: string;

   @IsNotEmpty()
   @IsNumber()
   @Type(() => Number)
   quantity: number;

   // @IsNotEmpty()
   // @IsNumber()
   // @Type(() => Number)
   // totalPrice: number;
}
