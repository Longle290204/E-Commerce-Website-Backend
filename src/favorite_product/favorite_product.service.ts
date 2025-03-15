import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteProduct } from './entities/favorite_product.entity';
import { Product } from 'src/products/Entities/product~entity';
import { User } from 'src/auth/user.entity';
import { CreateFavoriteProductDto } from './dto/create-favorite_product.dto';

@Injectable()
export class FavoriteProductService {
   constructor(
      @InjectRepository(FavoriteProduct) private readonly favoriteProductRepository: Repository<FavoriteProduct>,
      @InjectRepository(Product) private readonly productRepository: Repository<Product>,
      @InjectRepository(User) private readonly userRepository: Repository<User>,
   ) {}

   async addFavorite(user: User, dto: CreateFavoriteProductDto): Promise<void> {
      const product = await this.productRepository.findOne({ where: { id: dto.productId } });
      if (!product) throw new NotFoundException('Product not found');

      const existingFavorite = await this.favoriteProductRepository.findOne({
         where: { user: { id: user.id }, product: { id: product.id } },
      });

      if (existingFavorite) {
         // Nếu đã tồn tại, xóa nó
         await this.favoriteProductRepository.remove(existingFavorite);
      } else {
         // Nếu chưa tồn tại, tạo mới
         const favoriteProduct = this.favoriteProductRepository.create({ user, product });
         await this.favoriteProductRepository.save(favoriteProduct);
      }
   }

   async getFavoriteProducts(user: User): Promise<FavoriteProduct[]> {
      const favoriteList = await this.favoriteProductRepository.find({
         where: { user },
         relations: ['product'],
      });

      if (!favoriteList) {
         throw new NotFoundException(`Not found user`);
      }

      return favoriteList;
   }

   async removeFavoriteProducts(user: User, productId: string): Promise<void> {
      const favorite = await this.favoriteProductRepository.findOne({ where: { user, product: { id: productId } } });

      if (!favorite) throw new NotFoundException('Favorite not found');

      await this.favoriteProductRepository.remove(favorite);
   }
}
