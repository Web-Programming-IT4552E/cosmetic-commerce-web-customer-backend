import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { GetListDiscountCodeQueryDto } from './dtos/getListDiscountCode.query.dto';
import { DiscountCodeRepository } from './discount_code.repository';

@Injectable()
export class DiscountCodeService {
  constructor(
    private readonly discountCodeRepository: DiscountCodeRepository,
  ) {}

  async getListDiscountCodes(
    getListDiscountCodeQueryDto: GetListDiscountCodeQueryDto,
    user_id: string,
  ) {
    const query = {
      applied_user: {
        $elemMatch: {
          user_id: new Types.ObjectId(user_id),
          remaining: { $gt: 0 },
        },
      },
      expired_time: { $gt: new Date() },
      total_remaining: { $gt: 0 },
    };
    const selectOptions = {
      name: 1,
      code: 1,
      min_order_value: 1,
      description: 1,
      total_remaining: 1,
      expired_time: 1,
      applied_user: {
        $filter: {
          input: '$applied_user',
          as: 'out',
          cond: { $eq: ['$$out.user_id', new Types.ObjectId(user_id)] },
        },
      },
    };
    const { page, limit } = { ...getListDiscountCodeQueryDto };
    const data =
      await this.discountCodeRepository.getListDiscountCodesWithPaginationAndSelect(
        query,
        selectOptions,
        page,
        limit,
      );
    const numberOfDiscountCodes =
      await this.discountCodeRepository.countDiscountCodeDocument(query);
    return {
      paginationInfo: {
        page,
        limit,
        total: numberOfDiscountCodes,
      },
      data,
    };
  }

  getDetailDiscountCode(discount_code_id: string) {
    return `This action returns a #${discount_code_id} discountCode`;
  }
}
