import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';

@ApiTags('account')
@Controller('account')
export class CustomerAccountController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ description: 'Get customer by email' })
  @Get(':email')
  async getCurrentCustomerAccountInformations(@Param('email') email: string) {
    return this.customerService.getCurrentCustomerAccountInformation(email);
  }
}
