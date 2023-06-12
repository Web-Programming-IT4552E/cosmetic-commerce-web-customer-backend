import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { GetListDiscountCodeQueryDto } from './dtos/getListDiscountCode.query.dto';
import { DiscountCodeRepository } from './discount_code.repository';
import { AmountType } from './enums/amount-type.enum';
import { OrderInformationsDto } from './dtos/orderInformations.dto';

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

  getDetailDiscountCode(discount_code_id: string, user_id: string) {
    const query = {
      _id: discount_code_id,
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
    return this.discountCodeRepository.getDiscountCodeDetailByID(
      query,
      selectOptions,
    );
  }

  async tryApplyingDiscountAmountOnOrder(
    discount_code: string,
    user_id: string,
    total_product_cost: number,
  ) {
    const orderValue = total_product_cost;
    const discountCode =
      await this.discountCodeRepository.getDiscountCodeDetailByID(
        {
          code: discount_code,
          applied_user: {
            $elemMatch: {
              user_id: new Types.ObjectId(user_id),
              remaining: { $gt: 0 },
            },
          },
          expired_time: { $gt: new Date() },
          total_remaining: { $gt: 0 },
        },
        {},
      );
    if (!discountCode)
      throw new BadRequestException(
        'Cannot apply this discount code : Already expired or reached maximum',
      );
    if (orderValue < discountCode.min_order_value) {
      throw new BadRequestException(
        "The order value didn't reach the required minimum order value",
      );
    }
    if (discountCode.amount_type === AmountType.DIRECT) {
      return orderValue > discountCode.discount_amount
        ? discountCode.discount_amount.toString()
        : orderValue.toString();
    }
    if (discountCode.amount_type === AmountType.PERCENT) {
      return ((orderValue * discountCode.discount_amount) / 100).toString();
    }
    return '0';
  }

  async applyingDiscountOnOrder(
    discount_code: string,
    user_id: string,
    orderInformationDto: OrderInformationsDto,
  ) {
    const orderValue = orderInformationDto.total_product_cost;
    const query = {
      code: discount_code,
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
      applied_user: 1,
      min_order_value: 1,
      amount_type: 1,
      discount_type: 1,
      discount_amount: 1,
      total_remaining: 1,
    };
    const discountCode =
      await this.discountCodeRepository.getDiscountCodeDetailByID(
        query,
        selectOptions,
      );
    if (!discountCode)
      throw new BadRequestException(
        'Cannot apply this discount code : Already expired or reached maximum',
      );
    if (orderValue < discountCode.min_order_value) {
      throw new BadRequestException(
        "The order value didn't reach the required minimum order value",
      );
    }
    const indexOfUserInDiscountCodeAppliedUsers: number =
      discountCode.applied_user.findIndex((object) => {
        return object.user_id.toString() === user_id.toString();
      });
    const newAppliedUserArray = discountCode.applied_user;
    newAppliedUserArray[indexOfUserInDiscountCodeAppliedUsers].remaining -= 1;
    await this.discountCodeRepository.findOneAndUpdateDiscountCode(query, {
      $inc: {
        total_remaining: -1,
      },
      applied_user: newAppliedUserArray,
    });
    if (discountCode.amount_type === AmountType.DIRECT) {
      return orderValue > discountCode.discount_amount
        ? discountCode.discount_amount.toString()
        : orderValue.toString();
    }
    if (discountCode.amount_type === AmountType.PERCENT) {
      return ((orderValue * discountCode.discount_amount) / 100).toString();
    }
    return '0';
  }
}
