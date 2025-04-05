import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/Entities/product~entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category~entity';

@Injectable()
export class BreadcrumbService {
   constructor(
      @InjectRepository(Product) private productRepository: Repository<Product>,
      @InjectRepository(Category) private categoryRepository: Repository<Category>,
   ) {}

   async getBreadcrumb(slug: string, type: string) {
      const breadcrumb = [{ label: 'Trang chủ', path: '/' }];

      switch (type) {
         case 'category':
            const category = await this.categoryRepository.findOne({
               where: { slug },
            });

            if (category) {
               breadcrumb.push({ label: category?.name || slug, path: `/collections/${category.slug}` });
            }

            return breadcrumb;
         case 'product':
            const product = await this.productRepository.findOne({ where: { slug } });

            if (product) {
               breadcrumb.push({ label: product.name || slug, path: `/products/${slug}` });
            }
            return breadcrumb;
         default:
            if (slug) {
               breadcrumb.push({ label: slug.replace(/-/g, ' '), path: `/${type}/${slug}` });
            }
            break;
      }
   }

   async getBreadcrumbBySlug(slug: string) {
      const product = await this.productRepository.findOne({
         where: { slug },
      });

      if (product) {
         return [
            { label: 'Trang chủ', path: '/' },
            { label: product.name, path: `/${product.slug}` },
         ];
      } else {
         return new Promise((resolve, reject) => {
            this.productRepository.find().then((products) => {
               resolve(
                  products
                     .filter((product) => product.slug === slug)
                     .map((product) => ({ label: product.name, path: `/${product.slug}` })),
               );
            });
         });
      }
   }

   // const product = await this.productRepository.findOne({
   //    where: { slug },
   // });

   // if (!product) return [];

   // return [
   //    { label: 'Trang chủ', path: '/' },
   //    {
   //       label: product.mainCategory ? product.mainCategory.name : product.categories[0].name, // Kiểm tra trước khi truy cập
   //       path: product.mainCategory ? `/${product.mainCategory.name}` : '/${product.categories[0].name}',
   //    },
   //    { label: product.name, path: `/${product.slug}` },
   // ];
}
