import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFilterDto {
   @IsOptional()
   @IsString()
   search?: string;

   @IsOptional()
   @IsArray()
   @IsString({ each: true })
   category: string[];

   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @Min(1)
   page?: number = 1;

   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   @Min(1)
   limit?: number = 12;
}
