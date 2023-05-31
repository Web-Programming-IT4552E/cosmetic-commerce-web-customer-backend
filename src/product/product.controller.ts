import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ description: 'Get product list' })
  @ApiQuery({
    name: 'page',
    description: 'the page index',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'the number of items',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    description: 'filter with name of the product',
    required: false,
  })
  @Get('')
  async getProductList(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
  ) {
    return this.productService.getAllProducts(page, limit, name);
  }

  @ApiOperation({ description: 'Get product info by ID' })
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
}
