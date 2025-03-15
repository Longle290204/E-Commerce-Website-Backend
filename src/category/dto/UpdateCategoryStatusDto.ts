import { IsEnum, IsString } from 'class-validator';
import { CategoryStatus } from '../entities/category~entity';
import { string } from 'joi';

export class UpdateCategoryDto {
   @IsEnum(CategoryStatus)
   status: CategoryStatus;

   @IsString()
   name: string;
}
