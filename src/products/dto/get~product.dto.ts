import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetFilterDto {
   @IsOptional()
   @IsString()
   search?: string;

   @IsOptional()
   @IsArray()
   @IsString({ each: true })
   category: string[];

   // @IsOptional()
   // @IsNumber()
   // size: number;
}
