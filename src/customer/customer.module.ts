import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mailer/mail.module';
import { CustomerService } from './customer.service';
import { CustomerAccountController } from './customer-account.controller';
import { CustomerRepository } from './customer.repository';
import { customerProviders } from './customer.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, UserModule, MailModule],
  providers: [CustomerService, CustomerRepository, ...customerProviders],
  controllers: [CustomerAccountController],
  exports: [CustomerService],
})
export class CustomerModule {}
