import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/auth.decorator';
import { CategoryService } from './category.service';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ description: 'Get all categories' })
  @Public()
  @Get('categories')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
