import { Module } from '@nestjs/common';
import { DiscountCodeModule } from 'src/discount_code/discount_code.module';
import { AreaModule } from '../area/area.module';
import { DatabaseModule } from '../database/database.module';
import { ProductModule } from '../product/product.module';
import { MailModule } from '../mailer/mail.module';
import { OrderController } from './order.controller';
import { orderProviders } from './order.providers';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [
    DatabaseModule,
    AreaModule,
    ProductModule,
    MailModule,
    DiscountCodeModule,
  ],
  providers: [OrderService, OrderRepository, ...orderProviders],
  controllers: [OrderController],
})
export class OrderModule {}
