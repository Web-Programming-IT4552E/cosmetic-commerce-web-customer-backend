import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ShippingAddressDetail } from '../schemas/shipping-address-detail.schema';

export class UpdateShippingAddressDto {
  @Expose()
  @IsNotEmpty()
  @Type(() => ShippingAddressDetail)
  @ValidateNested()
  address_detail: ShippingAddressDetail;
}
