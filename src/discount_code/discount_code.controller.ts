import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtDecodedData } from 'src/common/decorators/auth.decorator';
import { JwtPayload } from 'src/auth/dtos/jwt-payload.dto';
import { DiscountCodeService } from './discount_code.service';
import { GetListDiscountCodeQueryDto } from './dtos/getListDiscountCode.query.dto';

@ApiTags('discount-code')
@Controller('discount-code')
export class DiscountCodeController {
  constructor(private readonly discountCodeService: DiscountCodeService) {}

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
}
