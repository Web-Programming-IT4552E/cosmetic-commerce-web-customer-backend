import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { Customer } from './schemas/customer.schema';

@Injectable()
export class CustomerRepository {
  constructor(
    @Inject(Customer)
    private readonly customerModel: ReturnModelType<typeof Customer>,
  ) {}

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    return this.customerModel.findOne({ email }).lean().exec();
  }

  async getCustomerByEmailAlongWithPassword(
    email: string,
  ): Promise<Customer | null> {
    return this.customerModel.findOne({ email }).select({
      _id: 1,
      email: 1,
      hashed_password: 1,
      type: 1,
      status: 1,
    });
  }

  async findOneCustomer(query: FilterQuery<Customer>) {
    return this.customerModel.findOne(query).lean();
  }

  async findOneCustomerWithPassword(query: FilterQuery<Customer>) {
    return this.customerModel
      .findOne(query)
      .select({
        _id: 1,
        email: 1,
        hashed_password: 1,
        type: 1,
        status: 1,
      })
      .lean();
  }

  async findOneCustomerAndUpdate(
    query: FilterQuery<Customer>,
    updateOptions: UpdateQuery<Customer>,
  ) {
    return this.customerModel
      .findOneAndUpdate(query, updateOptions, { new: true })
      .lean();
  }

  async createUser(createCustomerDto: any) {
    return this.customerModel.create({ ...createCustomerDto });
  }
}
