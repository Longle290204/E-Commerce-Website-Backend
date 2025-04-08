import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSizeDto {
   @IsNotEmpty()
   @IsInt()
   size: number;
}
