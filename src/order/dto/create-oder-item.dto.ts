import { UUID } from "crypto";
import { IsString, IsNumber, Min } from "class-validator";


export class CreateOrderItemDto {
   @IsString()
   productId: UUID;

   @IsNumber()
   size: number;

   @IsNumber()
   @Min(1)
   quantity: number;
}