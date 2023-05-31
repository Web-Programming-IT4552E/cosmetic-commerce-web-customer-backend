import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ description: 'Get all categories' })
  @Get('categories')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
