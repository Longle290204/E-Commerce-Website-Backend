import { Controller, Get, Patch, Param, UseGuards, Post, Delete, Body } from '@nestjs/common';
import { FavoriteProductService } from './favorite_product.service';
import { CreateFavoriteProductDto } from './dto/create-favorite_product.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Product } from 'src/products/Entities/product~entity';
import { FavoriteProduct } from './entities/favorite_product.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('favorites-product')
export class FavoriteProductController {
   constructor(private readonly favoriteProductService: FavoriteProductService) {}

   // @GetUser() user: User --> Lấy user từ http sau khi xác thực thành công

   @Post()
   addFavorite(@GetUser() user: User, @Body() dto: CreateFavoriteProductDto) {
      return this.favoriteProductService.addFavorite(user, dto);
   }

   @Get()
   getFavoriteProducts(@GetUser() user: User): Promise<FavoriteProduct[]> {
      return this.favoriteProductService.getFavoriteProducts(user);
   }

   @Delete('/:id')
   removeFavoriteProducts(@GetUser() user: User, @Param('productId') productId: string) {
      return this.favoriteProductService.removeFavoriteProducts(user, productId);
   }
}
