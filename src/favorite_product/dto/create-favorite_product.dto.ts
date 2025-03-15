import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavoriteProductDto {
   @IsNotEmpty()
   @IsString()
   productId: string;
}
