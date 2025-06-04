import { IsString, IsOptional } from "class-validator";

export class CreatePaymentDto {
   amount: number;

   @IsOptional()
   @IsString()
   orderDescription: string;
}