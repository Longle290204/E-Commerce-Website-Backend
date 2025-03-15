import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category, CategoryStatus } from './entities/category~entity';
import { NestedCategory } from './types/category.types';
import { CreateCategoryDto } from './dto/create~category.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryStatusDto';

@Injectable()
export class CategoryService {
   private categoryRepository = this.dataSource.getRepository(Category);
   constructor(private dataSource: DataSource) {}

   // <=================== CREATE CATEGORY AND SUBCATEGORY ======================>

   async createCategory(createCategoryDto: CreateCategoryDto, parentId: string): Promise<Category> {
      const { name, status } = createCategoryDto;
      let parentCategory = null;

      if (parentId) {
         parentCategory = await this.categoryRepository.findOne({ where: { id: parentId } });

         if (!parentCategory) {
            throw new NotFoundException(`Parent category with ID ${parentId} not found`);
         }
      }

      const category = this.categoryRepository.create({ name, status, parent: parentCategory });
      return await this.categoryRepository.save(category);
   }

   // <=================== CREATE SUBCATEGORY ======================>

   // async createSubCategory(subCategoryName: string, parentId: string): Promise<Category> {
   //     // Lấy danh mục cha từ cơ sở dữ liệu
   //     const parentCategory = await this.categoryRepository.findOne({
   //         where: { id: parentId },
   //     });

   //     if (!parentCategory) {
   //         throw new NotFoundException(`Parent category with ID ${parentId} not found`);
   //     }
   //     // Tạo danh mục con
   //     const subCategory = this.categoryRepository.create({
   //         name: subCategoryName,
   //         parent: parentCategory,
   //     });
   //     // Lưu vào cơ sở dữ liệu
   //     return await this.categoryRepository.save(subCategory);
   // }

   // <=================== GET ALL CATEGORIES ======================>

   async getNestedCategories(): Promise<NestedCategory[]> {
      const categories = await this.categoryRepository.find({
         relations: ['parent'],
      });
      const buildNestedTree = (parentId: string | null): NestedCategory[] => {
         return categories
            .filter((category) => (category.parent ? category.parent.id === parentId : parentId === null))
            .map((category) => ({
               id: category.id,
               name: category.name,
               parent: category.parent,
               status: category.status,
               createdAt: category.createdAt,
               upDatedAt: category.upDatedAt,
               subcategories: buildNestedTree(category.id),
            }));
      };
      return buildNestedTree(null);
   }

   // <=================== GET CATEGORIES BY ID ======================>

   async getCategoryById(id: string): Promise<Category> {
      const find = this.categoryRepository.findOne({ where: { id } });
      if (!find) {
         throw new NotFoundException(`Category with ${id} not found`);
      }
      return find;
   }

   // <=================== UPDATE CATEGORY ======================>

   async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
      const { name, status } = updateCategoryDto;

      const category = await this.categoryRepository.findOne({
         where: { id },
         relations: ['subcategories'],
      });

      if (!category) {
         throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Cập nhật trạng thái của danh mục hiện tại
      category.name = name;
      category.status = status;
      await this.categoryRepository.save(category);

      if (status === CategoryStatus.INACTIVE && category.subcategories.length > 0) {
         for (const subcategory of category.subcategories) {
            subcategory.status = CategoryStatus.INACTIVE;
            await this.categoryRepository.save(subcategory);
         }
      }

      return category;
   }
   // <=================== DELETE CATEGORY ======================>

   async deleteCategory(id: string): Promise<void> {
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
         throw new NotFoundException(`Category with ID ${id} not found`);
      }
   }
}
