import { IsNumber, IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CategoryStatus } from '../entities/category~entity';

export class CreateCategoryDto {
   @IsOptional()
   @IsNumber()
   id: string;

   @IsOptional()
   @IsString()
   name: string;

   @IsNotEmpty()
   @IsEnum(CategoryStatus)
   status: CategoryStatus;

   @IsString()
   @IsOptional()
   product: string;
}
