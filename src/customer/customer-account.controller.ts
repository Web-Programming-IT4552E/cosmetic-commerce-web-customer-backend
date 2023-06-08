import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/common/decorators/auth.decorator';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { CustomerService } from './customer.service';

@ApiTags('account')
@Controller('account')
export class CustomerAccountController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiBearerAuth()
  @ApiOperation({ description: 'Get current customer account' })
  @Get('')
  async getCurrentCustomerAccountInformations(
    @JwtDecodedData() data: JwtPayload,
  ) {
    return this.customerService.getCurrentCustomerAccountInformation(
      data.email,
    );
  }
}
