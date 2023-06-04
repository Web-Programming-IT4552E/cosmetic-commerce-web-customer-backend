import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async getCurrentCustomerAccountInformation(email: string) {
    return this.customerRepository.getCustomerByEmail(email);
  }
}
