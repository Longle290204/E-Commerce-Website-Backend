import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { FormCartDto } from '../dto/FormCart.dto';
import { Cart } from './entities/cart.entity';
import { GeneralCartService } from '../generalCart.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('cart')
export class CartController {
   constructor(private readonly generalCartService: GeneralCartService) {}

   // <--------- Add To Cart -------->
   @UseGuards(AuthGuard('jwt'))
   @Post()
   addToCart(@GetUser() user: User, @Body() formCartDto: FormCartDto): Promise<Cart> {
      const userId = user.id;
      return this.generalCartService.addToCart(userId, formCartDto);
   }

   // <--------- Get All Cart Item -------->
   @UseGuards(AuthGuard('jwt'))
   @Get()
   getAllCartItem(@GetUser() user: User): Promise<{ cartTotal: number; cartItems: Cart[] }> {
      const userId = user.id;
      return this.generalCartService.getAllCartItem(userId);
   }

   // <--------- Delete All Cart Items --------->
   @Delete('/delete-all')
   deleteAllCartItems(): Promise<void> {
      return this.generalCartService.deleteAllCartItems();
   }

   // <--------- Delete Cart Item --------
   @Delete('/:id')
   deleteCartItem(@Param('id') id: string): Promise<void> {
      return this.generalCartService.deleteCartItem(id);
   }

   // // <--------- Delete Multiple Cart Items --------->
   // @Delete()
   // deleteCartItems(@Body('ids') ids: string[]): Promise<void> {
   //    return this.generalCartService.deleteCartItems(ids);
   // }

   @UseGuards(AuthGuard('jwt')) // Đảm bảo route này có bảo vệ bởi JWT
   @Post('/increase-quantity/:productId')
   plusQuantity(@GetUser() user: User, @Param('productId') productId: string): Promise<void> {
      const userId = user.id;
      return this.generalCartService.plusQuantity(userId, productId);
   }

   @UseGuards(AuthGuard('jwt')) // Đảm bảo route này có bảo vệ bởi JWT
   @Post('/decrease-quantity')
   async minusQuantity(@GetUser() user: User, @Body('productId') productId: string): Promise<void> {
      const userId = user.id;
      await this.generalCartService.minusQuantity(userId, productId);
      await this.generalCartService.removeIfZero(userId, productId);
   }

   // <--------- Input Quantity -------->
   @UseGuards(AuthGuard('jwt'))
   @Post('/input-quantity')
   inputQuantity(@GetUser() user: User, @Body() formCartDto: FormCartDto): Promise<void> {
      const userId = user.id;
      return this.generalCartService.inputQuantity(userId, formCartDto);
   }

   @UseGuards(AuthGuard('jwt')) // Đảm bảo route này có bảo vệ bởi JWT
   @Get('/get-quantity')
   async getQuantityById(@GetUser() user: User, @Query('productId') productId: string): Promise<number> {
      const userId = user.id;
      return this.generalCartService.getQuantityById(userId, productId);
   }

   @Post('/remove-if-zero')
   async removeIfZero(@GetUser() user: User, @Body('productId') productId: string): Promise<void> {
      const userId = user.id;
      return this.generalCartService.removeIfZero(userId, productId);
   }
   @UseGuards(AuthGuard('jwt')) // Đảm bảo route này có bảo vệ bởi JWT
   @Get('/get-all-quantity')
   async getAllQuantity(@GetUser() user: User): Promise<{ productId: string; quantity: number }[]> {
      const userId = user.id;
      return this.generalCartService.getAllQuantity(userId);
   }
}

// Những route tĩnh nên được đưa lên trước những route động như "/:id" để tránh nhầm lẫn.
