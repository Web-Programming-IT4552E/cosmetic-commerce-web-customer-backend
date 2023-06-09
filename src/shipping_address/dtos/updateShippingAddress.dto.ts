import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ShippingAddressDetailDto } from './shippingAddressDetail.dto';

export class UpdateShippingAddressDto {
  @IsNotEmpty()
  @Type(() => ShippingAddressDetailDto)
  @ValidateNested()
  address_detail: ShippingAddressDetailDto;
}
