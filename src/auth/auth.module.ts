import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { CustomerModule } from 'src/customer/customer.module';
import { RedisCacheModule } from 'src/cache/redis/redis-cache.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [DatabaseModule, CustomerModule, RedisCacheModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
