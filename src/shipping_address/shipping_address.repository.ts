import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ShippingAddress } from './schemas/shipping_address.schema';

@Injectable()
export class ShippingAddressRepository {
  constructor(
    @Inject(ShippingAddress)
    private readonly shippingAddressModel: ReturnModelType<
      typeof ShippingAddress
    >,
  ) {}

  async getListShippingAddresss(
    query: FilterQuery<ShippingAddress>,
    page: number,
    limit: number,
  ) {
    return this.shippingAddressModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async countShippingAddressDocument(query: FilterQuery<ShippingAddress>) {
    return this.shippingAddressModel.countDocuments(query);
  }

  async getShippingAddressDetailByID(query: FilterQuery<ShippingAddress>) {
    return this.shippingAddressModel.findOne(query).lean();
  }

  async createShippingAddress(createShippingAddressDto: any) {
    await this.shippingAddressModel.create({
      ...createShippingAddressDto,
    });
  }

  async findOneAndUpdateShippingAddress(
    query: FilterQuery<ShippingAddress>,
    updateOptions: UpdateQuery<ShippingAddress>,
  ) {
    return this.shippingAddressModel.findOneAndUpdate(query, updateOptions, {
      new: true,
    });
  }
}
