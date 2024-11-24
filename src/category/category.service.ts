import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from './entities/category~entity';

@Injectable()
export class CategoryService {
  private categoryRepository = this.dataSource.getRepository(Category);
  constructor(private dataSource: DataSource) {}

  async createCategory(name: string): Promise<Category> {
    const category = this.categoryRepository.create({
      name,
    });
    return await this.categoryRepository.save(category);
  }

  async createSubcategory(
    parentId: number,
    subcategoryName: string,
  ): Promise<Category> {
    // Lấy danh mục cha từ cơ sở dữ liệu
    const parentCategory = await this.categoryRepository.findOneBy({
      id: parentId,
    });
    
    if (!parentCategory) {
      throw new NotFoundException(`Category with ID ${parentId} not found`);
    }

    // Tạo danh mục con
    const subcategory = this.categoryRepository.create({
      name: subcategoryName,
      parent: parentCategory,
    });

    // Lưu vào cơ sở dữ liệu
    return this.categoryRepository.save(subcategory);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['subcategories'] });
  }

  async getCategoryById(id: string): Promise<Category> {
    const find = this.categoryRepository.findOne({ where: { id } });
    if (!find) {
      throw new NotFoundException(`Category with ${id} not found`);
    }
    return find;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
