import { Injectable } from '@nestjs/common';
import { MongooseQueryOptions } from 'mongoose';
import { ProductRepository } from './product.repository';
import { getListProductsQueryDto } from './dtos/getListProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(getListProductQuery: getListProductsQueryDto) {
    const { page, limit, name, category, price_start, price_end, search } = {
      ...getListProductQuery,
    };
    const query: MongooseQueryOptions = {};
    if (name) {
      Object.assign(query, { name });
    }
    if (category) {
      Object.assign(query, { category: { $in: category.split(',') } });
    }
    if (price_start && price_end) {
      Object.assign(query, { price: { $gte: price_start, $lte: price_end } });
    }
    if (search) {
      Object.assign(query, {
        name: { $regex: `.*${search}.*`, $options: 'i' },
      });
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
