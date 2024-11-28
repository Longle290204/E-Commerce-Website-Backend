import { Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category~entity';
import { NestedCategory } from './types/category.types';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // <=================== CREATE CATEGORY ======================>
  @Post()
  async createCategory(@Body('name') name: string): Promise<Category> {
    return this.categoryService.createCategory(name);
  }

  // <=================== CREATE SUBCATEGORY ======================>
  @Post('/subcategory/:id')
  async createSubCategory(
    @Body('subCategoryName') subCategoryName: string,
    @Param('id') parentId: string,
  ): Promise<Category> {
    return this.categoryService.createSubCategory(subCategoryName, parentId);
  }

  // <=================== GET ALL CATEGORIES ======================>
  @Get()
  async getAllCategories(): Promise<NestedCategory[]> {
    return await this.categoryService.getNestedCategories();
  }

  // <=================== GET CATEGORIES BY ID ======================>
  @Get('/:id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  // <=================== DELETE CATEGORY ======================>
  @Delete('/:id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
