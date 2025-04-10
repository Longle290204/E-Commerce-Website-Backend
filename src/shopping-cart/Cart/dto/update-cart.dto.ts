import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartDto {
   @IsOptional()
   @IsUUID()
   productId: string;

   @IsOptional()
   @IsNumber()
   @Type(() => Number)
   quantity: number;

   @IsOptional()
   @IsNumber()
   @Type(() => Number)
   size: number;
}
