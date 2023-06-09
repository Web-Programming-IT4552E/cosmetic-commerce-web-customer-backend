import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountCodeService } from './discount_code.service';
import { GetListDiscountCodeQueryDto } from './dtos/getListDiscountCode.query.dto';

@ApiTags('discount-code')
@Controller('discount-code')
export class DiscountCodeController {
  constructor(private readonly discountCodeService: DiscountCodeService) {}

  @Get()
  getListDiscountCodes(@Query() getListDiscountCodeQueryDto:GetListDiscountCodeQueryDto) {
    return this.discountCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountCodeService.findOne(+id);
  }
}
