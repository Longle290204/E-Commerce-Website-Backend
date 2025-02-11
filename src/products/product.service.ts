import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateProductDto } from './dto/create~product.dto';
import { Product } from './Entities/product~entity';
import { NotFoundException } from '@nestjs/common';
import { GetFilterDto } from './dto/get~product.dto';
import { In } from 'typeorm';
import { Category } from 'src/category/entities/category~entity';
import { ProductImages } from './Entities/productImages.entity';

@Injectable()
export class ProductService {
   private productRepository = this.dataSource.getRepository(Product);
   private categoryRepository = this.dataSource.getRepository(Category);
   private productImagesRepsository = this.dataSource.getRepository(ProductImages);
   constructor(private dataSource: DataSource) {}

   async createProduct(createProductDto: CreateProductDto, image: Express.Multer.File): Promise<Product> {
      const { name, price, categoryId } = createProductDto;
      const mainImage = `http://localhost:3002/uploads/${image.filename}`;

      const categories = await this.categoryRepository.find({
         where: { id: In(categoryId || []) },
         relations: ['subcategories'],
      });

      const product = this.productRepository.create({
         name,
         price,
         mainImage,
         categories,
      });
      console.log(product);

      return await this.productRepository.save(product);
   }

   async addThumbnails(productId: string, images: string[]) {
      const product = await this.productRepository.findOne({ where: { id: productId } });

      if (!product) {
         throw new NotFoundException(`Product not exist`);
      }

      const imageEntities = images.map((url) => this.productImagesRepsository.create({ imageUrl: url, product }));

      await this.productImagesRepsository.save(imageEntities);
   }

   // <========================= Get products by category =============================>
   // Here, this will query all of subcategories when call parent category. And it will call recursive to take subcategory in subcategory

   // Get products by parent category
   async getFullCategoryHierarchy(categoryId: string): Promise<Category[]> {
      const category = await this.categoryRepository.findOne({
         where: { id: categoryId },
         relations: ['subcategories'],
      });
      //=> Đoạn này lấy ra các danh mục con lần 1

      if (!category) {
         throw new Error(`Category with ID ${categoryId} not found`);
      }

      const subcategoryHierarchies = category.subcategories
         ? await Promise.all(category.subcategories.map((subcategory) => this.getFullCategoryHierarchy(subcategory.id)))
         : [];

      return [category, ...subcategoryHierarchies.flat()];
   }

   // Get Product By CategoryId
   async getProductsByCategory(categoryId: string): Promise<Product[]> {
      const categories = await this.getFullCategoryHierarchy(categoryId);

      // Lấy danh sách ID của tất cả danh mục
      const categoryIds = categories.map((category) => category.id);

      // Truy xuất tất cả sản phẩm liên quan đến danh mục
      return this.productRepository
         .createQueryBuilder('product')
         .leftJoinAndSelect('product.categories', 'category')
         .leftJoinAndSelect('category.subcategories', 'subcategories')
         .where('category.id IN (:...categoryIds)', { categoryIds })
         .getMany();
   }

   // Get Products By Id
   async getProductById(id: string): Promise<Product> {
      const found = await this.productRepository.findOne({ where: { id } });

      if (!found) {
         throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return found;
   }

   // Find All Products
   getProducts(): Promise<Product[]> {
      return this.productRepository.find();
   }

   async deleteProduct(id: string): Promise<void> {
      const result = await this.productRepository.delete({ id });
      if (result.affected === 0) {
         throw new NotFoundException(`Task with ID "${id}" not found`);
      }
   }

   async getProductsFilterDto(filterDto: GetFilterDto): Promise<Product[]> {
      const { search } = filterDto;
      const query = this.productRepository.createQueryBuilder('product');

      // query.leftJoinAndSelect('product.categories', 'category');

      if (search) {
         query.andWhere('(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.price) LIKE LOWER(:search))', {
            search: `%${search}%`,
         });
      }

      try {
         const products = await query.getMany();
         return products;
      } catch (error) {
         throw new InternalServerErrorException();
      }
   }

   // async getNewProduct(): Promise<Product[]> {
   //   const tenDayAgo = new Date();
   //   tenDayAgo.setDate(tenDayAgo.getDate() - 10);

   //   return await this.productRepository.find({
   //     where: { date_added: MoreThanOrEqual(tenDayAgo) },
   //   });
   // }

   // async getBestSeller(): Promise<Product[]> {
   //   return await this.productRepository.find({
   //     where: { best_seller: true },
   //   });
   // }

   // async getCategoryProduct(category: ProductCategory): Promise<Product[]> {
   //   return await this.productRepository.find({ where: { category: category } });
   // }

   async updateProduct(id: string, name: string, price: string, imageURL?: string): Promise<Product> {
      const product = await this.getProductById(id);
      product.name = name;
      product.price = price;
      if (imageURL) {
         product.mainImage = imageURL;
      }
      await this.productRepository.save(product);
      return product;
   }
}
