import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
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
}
