import { Injectable } from '@nestjs/common';
import { MongooseQueryOptions } from 'mongoose';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(page: number, limit: number, name: string) {
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
      paginationInformation: {
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
}
