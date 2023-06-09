import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ShippingAddressDetailDto } from './shippingAddressDetail.dto';

export class CreateShippingAddressDto {
  @IsNotEmpty()
  @Type(() => ShippingAddressDetailDto)
  address_detail: ShippingAddressDetailDto;
}
