import { Get, Post, Body, Param, Delete, Patch, UseInterceptors } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category~entity';
import { NestedCategory } from './types/category.types';
import { UpdateCategoryDto } from './dto/UpdateCategoryStatusDto';
import { CreateCategoryDto } from './dto/create~category.dto';

@Controller('category')
export class CategoryController {
   constructor(private categoryService: CategoryService) {}

   // <=================== CREATE CATEGORY ======================>
   @Post()
   async createCategory(
      @Body() createCategoryDto: CreateCategoryDto,
      @Body('parentId') parentId: string,
   ): Promise<Category> {
      return this.categoryService.createCategory(createCategoryDto, parentId);
   }

   // <=================== CREATE SUBCATEGORY ======================>
   // @Post('/subcategory/:id')
   // async createSubCategory(
   //     @Body('subCategoryName') subCategoryName: string,
   //     @Param('id') parentId: string,
   // ): Promise<Category> {
   //     return this.categoryService.createSubCategory(subCategoryName, parentId);
   // }

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

   // <=================== UPDATE CATGORIES ======================>

   @Patch('/:id/updateCategory')
   async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
      return this.categoryService.updateCategory(id, updateCategoryDto);
   }

   // <=================== DELETE CATEGORY ======================>
   @Delete('/:id')
   async deleteCategory(@Param('id') id: string): Promise<void> {
      return this.categoryService.deleteCategory(id);
   }
}
