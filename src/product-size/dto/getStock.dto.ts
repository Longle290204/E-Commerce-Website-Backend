import { IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class GetStockDto {
   @IsUUID()
   productId: string;

   @IsNumber()
   @Type(() => Number) // Chuyển đổi từ string sang number nếu cần
   sizeId: number;
}
