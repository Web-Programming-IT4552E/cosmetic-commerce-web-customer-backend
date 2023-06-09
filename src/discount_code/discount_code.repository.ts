import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { DiscountCode } from './schemas/discount_code.schema';

@Injectable()
export class DiscountCodeRepository {
  constructor(
    @Inject(DiscountCode)
    private readonly discountCodeModel: ReturnModelType<typeof DiscountCode>,
  ) {}

  async getListDiscountCodesWithPaginationAndSelect(
    query: FilterQuery<DiscountCode>,
    selectOptions: Record<string, any>,
    page: number,
    limit: number,
  ) {
    return this.discountCodeModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(selectOptions)
      .lean();
  }

  async countDiscountCodeDocument(query: FilterQuery<DiscountCode>) {
    return this.discountCodeModel.countDocuments(query);
  }

  async getDiscountCodeDetailByID(query: FilterQuery<DiscountCode>) {
    return this.discountCodeModel.findOne(query).lean();
  }

  async createDiscountCode(createDiscountCodeDto: any) {
    await this.discountCodeModel.create({
      ...createDiscountCodeDto,
    });
  }

  async findOneAndUpdateDiscountCode(
    query: FilterQuery<DiscountCode>,
    updateOptions: UpdateQuery<DiscountCode>,
  ) {
    return this.discountCodeModel.findOneAndUpdate(query, updateOptions, {
      new: true,
    });
  }
}
