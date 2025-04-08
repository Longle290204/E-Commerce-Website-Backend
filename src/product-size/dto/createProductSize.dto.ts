import { IsInt, IsNotEmpty, IsArray, IsString } from 'class-validator';
export class CreateProductSizeDto {
   @IsArray()
   @IsNotEmpty()
   @IsInt({ each: true })
   sizeIds: number[]; // Danh sách id của các size sản phẩm, có thể để trống nếu không có size nào được chọn

   @IsNotEmpty()
   @IsString()
   productId: string;
}
