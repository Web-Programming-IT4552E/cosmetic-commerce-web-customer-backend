import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoose from 'mongoose';
import { DatabaseModule } from './database/database.module';
import { AreaModule } from './area/area.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { QueueModule } from './queue/queue.module';
import { MailModule } from './mailer/mail.module';
import { CustomerModule } from './customer/customer.module';
import { RedisCacheModule } from './cache/redis/redis-cache.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AreaModule,
    DatabaseModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    QueueModule,
    MailModule,
    CustomerModule,
    RedisCacheModule,
    AuthModule,
  ],
})
export class AppModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await mongoose.disconnect();
  }
}
