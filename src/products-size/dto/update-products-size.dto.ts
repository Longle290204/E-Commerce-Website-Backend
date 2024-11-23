import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsSizeDto } from './create-products-size.dto';

export class UpdateProductsSizeDto extends PartialType(CreateProductsSizeDto) {}
