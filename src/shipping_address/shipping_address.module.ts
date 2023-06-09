import { Module } from '@nestjs/common';
import { ShippingAddressService } from './shipping_address.service';
import { ShippingAddressController } from './shipping_address.controller';
import { ShippingAddressRepository } from './shipping_address.repository';
import { shippingAddressProviders } from './shipping_address.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ShippingAddressService,
    ShippingAddressRepository,
    ...shippingAddressProviders,
  ],
  controllers: [ShippingAddressController],
  exports: [ShippingAddressService],
})
export class ShippingAddressModule {}
