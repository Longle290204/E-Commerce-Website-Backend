import { Controller, Get, Param, Query } from '@nestjs/common';
import { BreadcrumbService } from './Breadcrumb.service';

@Controller('breadcrumb')
export class BreadcrumbController {
   constructor(private readonly breadcrumbService: BreadcrumbService) {}

   // Một tham số bắt buộc không thể đứng sau một tham số tùy chọn
   // type là tham số bắt buộc không thể đúng sau một tham số tùy chọn slug
   @Get()
   getBreadcrumb(@Query('type') type: string, @Query('slug') slug?: string) {
      return this.breadcrumbService.getBreadcrumb(slug, type);
   }
}
