import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetFilterDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsArray()
  category: number[];

  @IsOptional()
  @IsNumber()
  size: number;
}
