import { Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category~entity';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body('name') name: string): Promise<Category> {
    return this.categoryService.createCategory(name);
  }

  @Post('/subcategory/:id')
  async createSubCategory(
    @Body('subCategoryName') subCategoryName: string,
    @Param('id') parentId: string,
  ): Promise<Category> {
    return this.categoryService.createSubCategory(subCategoryName, parentId);
  }

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Delete()
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
