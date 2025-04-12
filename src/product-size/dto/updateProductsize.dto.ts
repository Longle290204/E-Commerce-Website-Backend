import { Type } from 'class-transformer';
import { IsInt, Min, IsString, IsNumber } from 'class-validator';

export class UpdateProductStockDto {
   @IsString()
   productId: string;

   @IsNumber()
   @Type(() => Number)
   sizeId: number;

   @IsNumber()
   @Type(() => Number)
   @Min(1)
   stock: number;
}
