import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from './entities/category~entity';
import { NestedCategory } from './types/category.types';

@Injectable()
export class CategoryService {
  private categoryRepository = this.dataSource.getRepository(Category);
  constructor(private dataSource: DataSource) {}

  // <=================== CREATE CATEGORY ======================>

  async createCategory(name: string): Promise<Category> {
    const category = this.categoryRepository.create({
      name,
    });
    return await this.categoryRepository.save(category);
  }

  // <=================== CREATE SUBCATEGORY ======================>

  async createSubCategory(
    subCategoryName: string,
    parentId: string,
  ): Promise<Category> {
    // Lấy danh mục cha từ cơ sở dữ liệu
    const parentCategory = await this.categoryRepository.findOne({
      where: { id: parentId },
    });

    if (!parentCategory) {
      throw new NotFoundException(
        `Parent category with ID ${parentId} not found`,
      );
    }
    // Tạo danh mục con
    const subCategory = this.categoryRepository.create({
      name: subCategoryName,
      parent: parentCategory,
    });
    // Lưu vào cơ sở dữ liệu
    return await this.categoryRepository.save(subCategory);
  }

  // <=================== GET ALL CATEGORIES ======================>

  async getNestedCategories(): Promise<NestedCategory[]> {
    const categories = await this.categoryRepository.find({
      relations: ['parent', 'subcategories'],
    });
    const buildNestedTree = (parentId: string | null): NestedCategory[] => {
      return categories
        .filter((category) =>
          category.parent ? category.parent.id === parentId : parentId === null,
        )
        .map((category) => ({
          id: category.id,
          name: category.name,
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

  // <=================== DELETE CATEGORY ======================>

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
