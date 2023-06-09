import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DiscountCodeService } from './discount_code.service';
import { DiscountCodeController } from './discount_code.controller';
import { discountCodeProviders } from './discount_code.provider';
import { DiscountCodeRepository } from './discount_code.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [DiscountCodeController],
  providers: [
    DiscountCodeService,
    DiscountCodeRepository,
    ...discountCodeProviders,
  ],
  exports: [DiscountCodeService],
})
export class DiscountCodeModule {}
