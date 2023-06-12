import { Injectable } from '@nestjs/common';
import { MongooseQueryOptions } from 'mongoose';
import { ProductRepository } from './product.repository';
import { getListProductsQueryDto } from './dtos/getListProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(getListProductQuery: getListProductsQueryDto) {
    const { page, limit, name } = { ...getListProductQuery };
    const query: MongooseQueryOptions = {};
    if (name) {
      Object.assign(query, { name });
    }
    const total = await this.productRepository.countNumberOfProductWithQuery(
      query,
    );
    const data = await this.productRepository.getProductList(
      query,
      page,
      limit,
    );
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getProductById(id: string) {
    return this.productRepository.getProductById(id);
  }

  async getProductsByIdList(idList: string[]) {
    return this.productRepository.getProductsByIdList(idList);
  }

  async findAndUpdateProductStockById(
    product_id: string,
    stock_consumed: number,
  ) {
    return this.productRepository.findOneProductAndUpdate(
      {
        _id: product_id,
      },
      { $inc: { stock: -stock_consumed } },
    );
  }
}
