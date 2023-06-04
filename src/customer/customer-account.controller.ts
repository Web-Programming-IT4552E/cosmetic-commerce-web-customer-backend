import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';

@ApiTags('customer-account')
@Controller('customer-account')
export class CustomerAccountController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ description: 'Get customer list' })
  @Get('')
  async getCurrentCustomerAccountInformations() {
    return 'Hello';
  }
}
