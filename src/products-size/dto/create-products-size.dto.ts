import { IsUUID, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductsSizeDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
