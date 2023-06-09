import { Module } from '@nestjs/common';
import { DiscountCodeService } from './discount_code.service';
import { DiscountCodeController } from './discount_code.controller';

@Module({
  controllers: [DiscountCodeController],
  providers: [DiscountCodeService]
})
export class DiscountCodeModule {}
