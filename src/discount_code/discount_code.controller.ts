import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/common/decorators/auth.decorator';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { DiscountCodeService } from './discount_code.service';
import { GetListDiscountCodeQueryDto } from './dtos/getListDiscountCode.query.dto';

@ApiTags('discount-code')
@Controller('discount-code')
export class DiscountCodeController {
  constructor(private readonly discountCodeService: DiscountCodeService) {}

  @ApiOperation({
    description: 'get List Discount Code',
  })
  @ApiBearerAuth()
  @Get()
  getListDiscountCodes(
    @Query() getListDiscountCodeQueryDto: GetListDiscountCodeQueryDto,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.discountCodeService.getListDiscountCodes(
      getListDiscountCodeQueryDto,
      jwtPayload.userId,
    );
  }

  @ApiOperation({
    description: 'Get discount code detail',
  })
  @ApiBearerAuth()
  @Get(':id')
  findOne(
    @Param('id') discount_code_id: string,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    return this.discountCodeService.getDetailDiscountCode(
      discount_code_id,
      jwtPayload.userId,
    );
  }

  @ApiOperation({
    description:
      'Get discount code amount when applying, param is code field, not objectId',
  })
  @ApiBearerAuth()
  @Get('/tryApplying/:discount_code')
  async getApplyingDiscountAmountOnOrder(
    @Param('discount_code') discount_code: string,
    @Query('total_product_cost') total_product_cost: string,
    @JwtDecodedData() jwtPayload: JwtPayload,
  ) {
    if (!total_product_cost || Number(total_product_cost) < 0) {
      throw new BadRequestException(
        'total_product_cost is required and must be >=0',
      );
    }
    return this.discountCodeService.tryApplyingDiscountAmountOnOrder(
      discount_code,
      jwtPayload.userId,
      Number(total_product_cost),
    );
  }
}
