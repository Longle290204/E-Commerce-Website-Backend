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

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
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
