import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "./create-oder-item.dto";

export class CreateOrderDto {
   @IsArray()
   @ValidateNested({ each: true })
   @Type(() => CreateOrderItemDto)
   orders: CreateOrderItemDto[];
}
